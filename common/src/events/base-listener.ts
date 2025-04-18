import nats, { Message, Stan } from "node-nats-streaming";
import { Subject } from "./subjects";
interface Event {
	subject: Subject;
	data: any;
}

export abstract class listener<T extends Event> {
	abstract queueGroupName: string;
	abstract subject: T["subject"];
	abstract onMessage(data: T["data"], msg: Message): void;
	protected client: Stan;
	protected ackWait = 5 * 1000;

	constructor(client: Stan) {
		this.client = client;
	}

	subscriptionOptions() {
		return this.client
			.subscriptionOptions()
			.setDeliverAllAvailable()
			.setManualAckMode(true)
			.setAckWait(this.ackWait)
			.setDurableName(this.queueGroupName);
	}

	listen() {
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		);

		subscription.on("message", (msg: Message) => {
			console.log(`Message Received: ${this.subject} / ${this.queueGroupName}`);
			const parsedData = this.parseMessage(msg);
			this.onMessage(parsedData, msg);
		});
	}

	parseMessage(msg: Message) {
		const data = msg.getData();
		return typeof data === "string"
			? JSON.parse(data)
			: JSON.parse(data.toString("utf-8"));
	}
}
