import cors from "cors";
import express from "express";
import { createExpressLogger, Log } from "../../logging-middleware/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.use(createExpressLogger("middleware"));
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  Log("backend", "info", "route", "Health route invoked");
  res.json({
    success: true,
    message: "Notification backend is running"
  });
});

app.use("/api/notifications", notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
