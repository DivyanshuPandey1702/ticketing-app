import express, { Request, Response } from "express";
import { Event } from "../models/events";

const router = express.Router();
router.get("/api/evnets", async (req: Request, res: Response) => {
  const events = await Event.find({});
  res.send(events);
});

export { router as indexEventRouter };
