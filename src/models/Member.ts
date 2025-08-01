import mongoose, { Schema, Document } from 'mongoose';

export interface IMember extends Document {
  name: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: Date;
  nationalId: string;
  mobileNumber: string;
  nomineeName: string;
  pin: string;
  isActive: boolean;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<IMember>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  motherName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  nationalId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nomineeName: {
    type: String,
    required: true,
    trim: true
  },
  pin: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
memberSchema.index({ mobileNumber: 1 });
memberSchema.index({ nationalId: 1 });
memberSchema.index({ isActive: 1 });

export const Member = mongoose.model<IMember>('Member', memberSchema);