import { Types } from "mongoose";
import { UserRole } from "./user.constant";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string | undefined;
  phone: string;
  address: string;
  role: UserRole;
  isBlocked?: boolean;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
