import { Subject } from "./subjects";
export interface TicketUpdatedEvent {
	subject: Subject.TicketUpdate;
	data: {
		id: string;
		title: string;
		price: number;
		userId: string;
		version: number;
		orderId?: string;
	};
}
