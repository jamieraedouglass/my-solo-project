// server/models/userModel.ts
import {
  Schema,
  model,
  type Model,
  type HydratedDocument,
  type InferSchemaType,
} from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// 1) Parameterize the schema with <User, UserModel, UserMethods>
const userSchema = new Schema<User, UserModel, UserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    name: { type: String, trim: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// 2) Derived TS types
type User = InferSchemaType<typeof userSchema>;

export type UserMethods = {
  setPassword(plain: string): Promise<void>;
  validatePassword(plain: string): Promise<boolean>;
};

export type UserDoc = HydratedDocument<User, UserMethods>;

// 3) Put methods in the 3rd generic position of Model
export interface UserModel extends Model<User, {}, UserMethods> {
  findByEmail(email: string): Promise<UserDoc | null>;
}

// Instance methods
userSchema.methods.setPassword = async function (this: UserDoc, plain: string) {
  this.passwordHash = await bcrypt.hash(plain, SALT_ROUNDS);
};

userSchema.methods.validatePassword = async function (
  this: UserDoc,
  plain: string
) {
  if (!this.passwordHash) {
    const fresh = await UserModelImpl.findById(this._id).select(
      '+passwordHash'
    );
    if (!fresh?.passwordHash) return false;
    return bcrypt.compare(plain, fresh.passwordHash);
  }
  return bcrypt.compare(plain, this.passwordHash);
};

// Statics (type `this`!)
userSchema.statics.findByEmail = function (
  this: UserModel,
  email: string
): Promise<UserDoc | null> {
  return this.findOne({ email });
};

// Model
const UserModelImpl = model<User, UserModel>('User', userSchema);
export default UserModelImpl;
