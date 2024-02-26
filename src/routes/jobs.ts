import express from "express";
import testUser from "../middleware/testUser";
import { createJob, deleteJob, getAllJobs, getJob, showStats } from "../controllers/jobs";
import { updateUser } from "../controllers/auth";

const jobsRouter = express.Router();

jobsRouter.route("/").post(testUser, createJob).get(getAllJobs);
jobsRouter.route("/stats").get(showStats);

jobsRouter
  .route("/:id")
  .get(getJob)
  .delete(testUser, deleteJob)
  .patch(testUser, updateUser);

export default jobsRouter;
