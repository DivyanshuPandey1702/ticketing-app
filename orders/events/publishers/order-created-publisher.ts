import {
  Publisher,
  OrderCreatedEvent,
  Subject,
} from "@ticketsappchinmay/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
}
