import {
  Publisher,
  Subject,
  TicketUpdatedEvent,
} from "@ticketsappchinmay/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subject.TicketUpdate = Subject.TicketUpdate;
}
