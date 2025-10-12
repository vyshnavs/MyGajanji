const mongoose = require("mongoose");
const { Schema } = mongoose;


const transactionSchema = new Schema({
user: { type: Schema.Types.ObjectId, ref: "User", required: true },
amount: { type: Number, required: true },
type: { type: String, enum: ["income", "expense"], required: true },
category: { type: String, required: true },
date: { type: Date, required: true },
method: { type: String },
notes: { type: String },
}, { timestamps: true });


module.exports = mongoose.model("Transaction", transactionSchema);