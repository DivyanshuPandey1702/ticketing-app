import { Subject } from "./subjects";
export interface orderCancelledEvent {
  subject: Subject.orderCancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}
