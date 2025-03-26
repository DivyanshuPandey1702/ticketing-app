import { Message } from "node-nats-streaming";
import {
  Subject,
  listener,
  TicketCreatedEvent,
} from "@ticketsappchinmay/common";
import { queueGroupName } from "./queue-group-name";

import { Ticket } from "../../src/models/tickets";
export class TicketCreatedListner extends listener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
