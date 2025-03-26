import {
  NotAuthorizeError,
  NotFoundError,
  requireAuth,
} from "@ticketsappchinmay/common";
import experss, { Request, Response } from "express";
const router = experss.Router();
import { Order } from "../models/order";

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizeError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
