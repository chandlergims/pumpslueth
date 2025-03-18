import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description: string;
  imageUrl: string; // Now required
  creator: string; // wallet address of the creator
  attributes: {
    [key: string]: string | number;
  };
  votes: number;
  voters: string[]; // wallet addresses of voters
  isTokenized: boolean;
  tokenId?: string;
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
      required: true,
    },
    creator: {
      type: String,
      required: true,
      index: true,
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
    isTokenized: {
      type: Boolean,
      default: false,
    },
    tokenId: {
      type: String,
    },
  },
  { timestamps: true }
);

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema);
