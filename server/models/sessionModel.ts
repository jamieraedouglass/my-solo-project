// import mongoose from 'mongoose';
// const Schema = mongoose.Schema;

// const sessionSchema = new Schema({
//   cookieId: { type: String, required: true, unique: true },
//   createdAt: { type: Date, expires: 30, default: Date.now }
// });

// export default mongoose.model('Session', sessionSchema);
// server/models/sessionModel.ts
import { Schema, model } from 'mongoose';
const sessionSchema = new Schema(
  { cookieId: { type: String, required: true, unique: true } },
  { timestamps: true }
  // no TTL unless you want expiry
);
export default model('Session', sessionSchema);
