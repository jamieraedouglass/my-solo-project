// server/models/userModel.ts
import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    // Store only a hash — never the raw password
    passwordHash: {
      type: String,
      required: true,
      select: false, // don't return hash by default
    },
    name: { type: String, trim: true },
  },
  { timestamps: true }
);

// --------------------
// Instance methods
// --------------------
userSchema.methods.setPassword = async function (this: UserDoc, plain: string) {
  this.passwordHash = await bcrypt.hash(plain, SALT_ROUNDS);
};

userSchema.methods.validatePassword = async function (
  this: UserDoc,
  plain: string
) {
  // Ensure we have the hash (if the doc was loaded without it)
  if (!this.passwordHash) {
    const fresh = await User.findById(this._id).select('+passwordHash');
    if (!fresh?.passwordHash) return false;
    return bcrypt.compare(plain, fresh.passwordHash);
  }
  return bcrypt.compare(plain, this.passwordHash);
};

// --------------------
// Types
// --------------------
type UserSchema = InferSchemaType<typeof userSchema>;

export interface UserDoc extends mongoose.Document, UserSchema {
  setPassword(plain: string): Promise<void>;
  validatePassword(plain: string): Promise<boolean>;
}

export interface UserModel extends Model<UserDoc> {
  findByEmail(email: string): Promise<UserDoc | null>;
}

// --------------------
// Statics
// --------------------
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
export default User;
