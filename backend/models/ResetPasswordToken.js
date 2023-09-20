/* Schema for a password reset token */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
	/* MongoDB default generates a globally unique _id field */
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user",
		unique: true,
	},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 3600 }, // token expires after 3600 seconds (1 hour)
});

module.exports = mongoose.model("ResetPasswordToken", schema);