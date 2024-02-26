import "dotenv/config";
import "express-async-errors";
import helmet from "helmet";
import express, { Request, Response } from "express";
import path from "path";
import url from "url";
import cors from "cors";
import authRouter from "./routes/auth";
import authMid from "./middleware/authentication";
import jobsRouter from "./routes/jobs";
import notFoundMid from "./middleware/not-found";
import errorHandlerMid from "./middleware/error-handler";
import connectDB from "./db/connect";

let corsOptions = { origin: "*", optionSuccessStatus: 200 };

//__dirname and __filename are not used in ESM, this is a workaround
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMid, jobsRouter);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMid);
app.use(errorHandlerMid);

const port = process.env.PORT || 5174;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
}

start();
