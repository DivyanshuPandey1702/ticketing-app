import {
  Publisher,
  orderCancelledEvent,
  Subject,
} from "@ticketsappchinmay/common";

export class OrderCancelledPublisher extends Publisher<orderCancelledEvent> {
  subject: Subject.orderCancelled = Subject.orderCancelled;
}
