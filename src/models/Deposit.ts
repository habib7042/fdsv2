import mongoose, { Schema, Document } from 'mongoose';

export interface IDeposit extends Document {
  memberId: string;
  month: number;
  year: number;
  amount: number;
  isApproved: boolean;
  approvedAt?: Date;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const depositSchema = new Schema<IDeposit>({
  memberId: {
    type: String,
    required: true,
    ref: 'Member'
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 500
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: String
  }
}, {
  timestamps: true
});

// Compound unique index for memberId, month, and year
depositSchema.index({ memberId: 1, month: 1, year: 1 }, { unique: true });

// Indexes for better performance
depositSchema.index({ memberId: 1 });
depositSchema.index({ isApproved: 1 });
depositSchema.index({ createdAt: -1 });

export const Deposit = mongoose.model<IDeposit>('Deposit', depositSchema);