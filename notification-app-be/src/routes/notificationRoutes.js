import { Router } from "express";
import {
  getNotifications,
  getPriorityNotifications
} from "../services/notificationService.js";
import { Log } from "../../../logging-middleware/index.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    Log("backend", "info", "route", "All notifications route invoked");
    const result = await getNotifications(req.query, req.headers.authorization);

    res.json({
      success: true,
      notifications: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
});

router.get("/priority", async (req, res, next) => {
  try {
    Log("backend", "info", "route", "Priority notifications route invoked");
    const result = await getPriorityNotifications(
      req.query,
      req.headers.authorization
    );

    res.json({
      success: true,
      notifications: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
});

export default router;
