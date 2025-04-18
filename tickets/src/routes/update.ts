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
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";

import { Ticket } from "../models/tickets";
import { natsWrapper } from "../nats-wrapper";

router.put(
  "/api/tickets/:id",
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizeError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
