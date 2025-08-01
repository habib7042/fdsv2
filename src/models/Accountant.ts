import mongoose, { Schema, Document } from 'mongoose';

export interface IAccountant extends Document {
  name: string;
  mobileNumber: string;
  pin: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const accountantSchema = new Schema<IAccountant>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  pin: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
accountantSchema.index({ mobileNumber: 1 });
accountantSchema.index({ isActive: 1 });

export const Accountant = mongoose.model<IAccountant>('Accountant', accountantSchema);