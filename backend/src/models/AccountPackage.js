import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AccountPackage = new Schema(
  {
    package: {type: Number},
    name: { type: String },
    priceVND: {type: Number},
    priceUSD : {type: Number},
    numberOfDevices: {type: Number},
    description: {type: String}
  }
);


export default mongoose.model("AccountPackage", AccountPackage);