import {
  listener,
  OrderCreatedEvent,
  OrderStatus,
  Subject,
} from "@ticketsappchinmay/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListner extends listener<OrderCreatedEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subject.OrderCreated = Subject.OrderCreated;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as being reserved by setting its orderId prorperty
    ticket.set({ orderId: data.id });

    //Save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    });

    //ack the message
    msg.ack();
  }
}
