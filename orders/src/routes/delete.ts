import experss, { Request, Response } from "express";
const router = experss.Router();
import { Order, OrderStatus } from "../models/order";
import {
  NotAuthorizeError,
  NotFoundError,
  requireAuth,
} from "@ticketsappchinmay/common";
import { OrderCancelledPublisher } from "../../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizeError();
    }

    order.status = OrderStatus.Cancellled;
    await order.save();
    //publish an event saying this was cancelled!

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
