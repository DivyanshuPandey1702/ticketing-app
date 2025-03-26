import {
  orderCancelledEvent,
  Subject,
  listener,
} from "@ticketsappchinmay/common";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order";

export class OrderCancelledListerner extends listener<orderCancelledEvent> {
  queueGroupName: string = this.queueGroupName;
  subject: Subject.orderCancelled = Subject.orderCancelled;
  async onMessage(data: orderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.Cancellled });
    await order.save();
    msg.ack();
  }
}
