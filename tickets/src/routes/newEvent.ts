import express, { Request, Response, Router } from "express";
const router = express.Router();
import { requireAuth, validateRequest } from "@ticketsappchinmay/common";
import { Event } from "../models/events";
import { body } from "express-validator";

import { natsWrapper } from "../nats-wrapper";

router.post(
  "/api/events",
  requireAuth,
  [
    body("name").not().isEmpty().withMessage("Name for event is required"),
    body("description").withMessage("description is required"),
    body("type").withMessage("type of Event is Required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      description,
      type,
      genre,
      address,
      city,
      state,
      country,
      language,
      duration,
      date,
      startDate,
      endDate,
      performers,
      userId,
    } = req.body;

    const location = { address, city, state, country };

    const event = Event.build({
      name,
      description,
      type,
      genre,
      language,
      duration,
      date,
      performers,
      startDate,
      endDate,
      location,
      userId,
    });
    await event.save();

    res.status(201).send(event);
  }
);

export { router as createEventRouter };
