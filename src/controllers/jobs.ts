import Job from "../models/Job.ts";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/custom-errors.ts";
import moment from "moment";
import mongoose from "mongoose";
import { Response, Request } from "express";

async function getAllJobs(req: Request, res: Response) {
  const { search, status, jobType, sort } = req.query;

  const queryObject: any = {
    createdBy: req.user.userID,
    position: "",
    status: "",
    jobType: "",
  };

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  let result = Job.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
}

async function getJob(req: Request, res: Response) {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const job = await Job.findOne({
    _id: jobID,
    createdBy: userID,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }
  res.status(StatusCodes.OK).json({ job });
}

async function createJob(req: Request, res: Response) {
  req.body.createdBy = req.user.userID;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
}

async function updateJob(req: Request, res: Response) {
  const {
    body: { company, position },
    user: { userID },
    params: { id: jobID },
  } = req;

  if (company == "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }
  res.status(StatusCodes.OK).json({ job });
}

async function deleteJob(req: Request, res: Response) {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const job = await Job.findByIdAndDelete({
    _id: jobID,
    createdBy: userID,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobID}`);
  }
  res.status(StatusCodes.OK).send();
}

async function showStats(req: Request, res: Response) {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userID) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  let statsObj = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: statsObj.pending || 0,
    interview: statsObj.interview || 0,
    declined: statsObj.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userID) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");

      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
}

export { createJob, deleteJob, getAllJobs, updateJob, getJob, showStats };
