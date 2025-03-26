import {
  Subject,
  Publisher,
  ExpirationCompleteEvent,
} from "@ticketsappchinmay/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
}
