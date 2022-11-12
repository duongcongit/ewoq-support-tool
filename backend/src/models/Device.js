import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Device = new Schema(
  {
    username: {type: String},
    name: { type: String },
    browserUserAgent: {type: String},
    submitHistory: {type: Object},
    timeWorkHistory: {type: Object}
  }
);


export default mongoose.model("Device", Device);