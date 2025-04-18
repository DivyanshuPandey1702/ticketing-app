import mongoose, { mongo } from "mongoose";
import { OrderStatus } from "@ticketsappchinmay/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface OrderAttrs {
  id: string;
  status: OrderStatus;
  version: number;
  price: number;
  userId: string;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  version: number;
  price: number;
  userId: string;
}

interface OrderModal extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: Number,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModal>("Order", orderSchema);

export { Order, OrderStatus };
