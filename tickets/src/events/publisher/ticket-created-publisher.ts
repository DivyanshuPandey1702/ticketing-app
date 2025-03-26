import {
  Publisher,
  Subject,
  TicketCreatedEvent,
} from "@ticketsappchinmay/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
