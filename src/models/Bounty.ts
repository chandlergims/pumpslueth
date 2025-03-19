import mongoose, { Schema, Document } from 'mongoose';

export interface IBounty extends Document {
  title: string;
  description: string;
  imageUrl?: string;
  creator: string;
  bountyAmount: number;
  status: 'open' | 'solved' | 'closed';
  solver?: string;
  solutionDetails?: string;
  solutionImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
}

const BountySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    creator: {
      type: String,
      required: [true, 'Creator wallet address is required'],
    },
    bountyAmount: {
      type: Number,
      required: [true, 'Bounty amount is required'],
      min: [0.1, 'Bounty amount must be at least 0.1 SOL'],
    },
    status: {
      type: String,
      enum: ['open', 'solved', 'closed'],
      default: 'open',
    },
    solver: {
      type: String,
    },
    solutionDetails: {
      type: String,
    },
    solutionImageUrl: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Bounty || mongoose.model<IBounty>('Bounty', BountySchema);
