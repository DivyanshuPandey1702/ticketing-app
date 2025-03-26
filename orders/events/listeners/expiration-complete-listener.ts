import {
  ExpirationCompleteEvent,
  Subject,
  listener,
  OrderStatus,
} from "@ticketsappchinmay/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../src/models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../src/nats-wrapper";

export class ExpirationCompleteListner extends listener<ExpirationCompleteEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancellled,
    });
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
