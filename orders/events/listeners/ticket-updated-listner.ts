import { Message } from "node-nats-streaming";
import {
  Subject,
  listener,
  TicketUpdatedEvent,
} from "@ticketsappchinmay/common";
import { Ticket } from "../../src/models/tickets";

import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListner extends listener<TicketUpdatedEvent> {
  subject: Subject.TicketUpdate = Subject.TicketUpdate;
  queueGroupName: string = queueGroupName;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
