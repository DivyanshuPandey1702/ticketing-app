import {
  Subject,
  listener,
  PaymentCreatedEvent,
} from "@ticketsappchinmay/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../src/models/order";
import { OrderStatus } from "@ticketsappchinmay/common";

export class PaymentCreatedListener extends listener<PaymentCreatedEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subject.PaymentCreated = Subject.PaymentCreated;
  async onMessage(
    data: { id: string; orderId: string; stripeId: string },
    msg: Message
  ) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("order not found");
    }
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
    msg.ack();
  }
}
