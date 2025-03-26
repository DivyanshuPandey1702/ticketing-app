import { listener } from "./base-listener";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subject } from "./subjects";

export class TicketCreatedListner extends listener<TicketCreatedEvent> {
  readonly subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName: string = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data!", data);
    msg.ack();
  }
}
