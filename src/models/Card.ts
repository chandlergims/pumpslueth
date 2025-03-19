import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description: string;
  imageUrl?: string; // Optional now
  creator: string; // wallet address of the creator
  bountyAmount: number; // Amount in SOL for the bounty
  status: 'open' | 'solved' | 'closed'; // Status of the bounty
  solver?: string; // Wallet address of the person who solved it
  evidence?: string; // Evidence provided by the solver
  attributes: {
    [key: string]: string | number;
  };
  votes: number;
  voters: string[]; // wallet addresses of voters
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    creator: {
      type: String,
      required: true,
      index: true,
    },
    bountyAmount: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'solved', 'closed'],
      default: 'open',
    },
    solver: {
      type: String,
      required: false,
    },
    evidence: {
      type: String,
      required: false,
    },
    attributes: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    votes: {
      type: Number,
      default: 0,
    },
    voters: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema);
