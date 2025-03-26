import {
  listener,
  Subject,
  OrderCreatedEvent,
} from "@ticketsappchinmay/common";
import { Order, OrderStatus } from "../../models/order";

import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
export class OrderCreatedListerner extends listener<OrderCreatedEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subject.OrderCreated = Subject.OrderCreated;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();
    msg.ack();
  }
}
