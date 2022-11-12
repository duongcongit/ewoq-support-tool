import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Admin = new Schema(
  {
    name: { type: String },
    username: { type: String},
    password: {type: String}
  }
);


export default mongoose.model("Admin", Admin);