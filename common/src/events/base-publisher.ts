import { Stan } from "node-nats-streaming";
import { Subject } from "./subjects";
import { convertToObject } from "typescript";
interface Event {
	subject:
		| Subject.TicketCreated
		| Subject.TicketUpdate
		| Subject.OrderCreated
		| Subject.orderCancelled
		| Subject.ExpirationComplete
		| Subject.PaymentCreated;
	data: any;
}
export abstract class Publisher<T extends Event> {
	abstract subject: T["subject"];
	protected client: Stan;
	constructor(client: Stan) {
		this.client = client;
	}

	publish(data: T["data"]): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.publish(this.subject, JSON.stringify(data), (err) => {
				if (err) return reject(err);

				console.log("event subject to subject", this.subject);
				resolve();
			});
		});
	}
}
