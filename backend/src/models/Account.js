import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Account = new Schema(
  {
    name: { type: String },
    username: { type: String},
    password: {type: String},
    accountType: {type: Number},
    userAPIKey: {type: String},
    status: {type: Number},
    createAt: {type: String},
    deleteAt: {type: String}
  }
);


export default mongoose.model("Account", Account);