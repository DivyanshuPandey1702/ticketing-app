import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { OrderCancelledListerner } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListerner } from "./events/listeners/order-created-listeners";

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY not Defined");
	}
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}
	if (!process.env.NATS_CLIENT_ID) {
		throw new Error("NSTD_CLIENT_ID must be defined");
	}
	if (!process.env.NATS_URL) {
		throw new Error("NATS_URI must be defined");
	}
	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error("NATS_CLUSTER_ID must be defined");
	}
	try {
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URL
		);
		natsWrapper.client.on("close", () => {
			console.log("NATS connection closed!");
			process.exit();
		});
		process.on("SIGINT", () => natsWrapper.client.close());
		process.on("SIGTERM", () => natsWrapper.client.close());

		new OrderCreatedListerner(natsWrapper.client).listen();
		new OrderCancelledListerner(natsWrapper.client).listen();

		await mongoose.connect(process.env.MONGO_URI);
		console.log("connected to mongodbd");
	} catch (err) {
		console.log("err:", err);
	}
};

app.listen(3000, () => {
	console.log("listening on port 3000!!!!!!");
});
start();
