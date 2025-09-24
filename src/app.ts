import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { envVariables } from "./app/config/env";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

// ---------------------- Global Middlewares ---------------------- //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: envVariables.FRONTEND_URL, credentials: true }));

// ---------------------- Application Routes ---------------------- //
app.use("/api/v1/", router);

// Health-check endpoint
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "OK", message: "Your Backend API is working" });
});

// ---------------------- Error Handling ---------------------- //

// Global error handler (catches all thrown errors and formats response).
app.use(globalErrorHandler);

// 404 handler for undefined routes.
app.use(notFound);

export default app;
