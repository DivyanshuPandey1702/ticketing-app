import {
  Subject,
  listener,
  orderCancelledEvent,
} from "@ticketsappchinmay/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
export class orderCancelledListner extends listener<orderCancelledEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subject.orderCancelled = Subject.orderCancelled;

  async onMessage(data: orderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });
    msg.ack();
  }
}
