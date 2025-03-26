import {
  Subject,
  Publisher,
  PaymentCreatedEvent,
} from "@ticketsappchinmay/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subject.PaymentCreated = Subject.PaymentCreated;
}
