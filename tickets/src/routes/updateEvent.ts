import express, { Request, Response } from "express";
const router = express.Router();
import { body } from "express-validator";

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizeError,
  BadRequestError,
} from "@ticketsappchinmay/common";

import { Event } from "../models/events";
import { natsWrapper } from "../nats-wrapper";
//send only those field which is going to send
router.put(
  "/api/event/:id",
  requireAuth,
  [
    body("name").not().isEmpty().withMessage("Name for event is required"),
    body("description").withMessage("description is required"),
    body("type").withMessage("type of Event is Required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      throw new NotFoundError();
    }
    if (event.userId !== req.currentUser!.id) {
      throw new NotAuthorizeError();
    }

    event.set(req.body);

    await event.save();

    res.send(event);
  }
);

export { router as updateEventRouter };
