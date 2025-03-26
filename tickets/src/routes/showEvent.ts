import express, { Request, Response } from "express";
import { Event } from "../models/events";

import { NotFoundError } from "@ticketsappchinmay/common";

const router = express.Router();

router.get("/api/event/:id", async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new NotFoundError();
  }

  res.send(event);
});

export { router as showEventRouter };
