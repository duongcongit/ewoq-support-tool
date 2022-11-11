import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: { type: String },
    username: { type: String},
    password: {type: String},
    email: {type: String},
    accountType: {type: Number},
    balance: {type: Number},
    status: {type: Number},
    createAt: {type: String},
    deleteAt: {type: String},
    activeAt: {type: String},
    activeCode: {type: String}
  }
);


export default mongoose.model("User", User);