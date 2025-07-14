import mongoose from "mongoose";
import { MONGODB_URI } from "./config";

export const db = await mongoose.connect(MONGODB_URI);
