import mongoose, { Schema, Document } from 'mongoose';

export interface ISolution extends Document {
  bountyId: string;
  solver: string;
  solutionDetails: string;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
  votes: number;
  voters: string[];
}

const SolutionSchema: Schema = new Schema(
  {
    bountyId: {
      type: String,
      required: [true, 'Bounty ID is required'],
      ref: 'Bounty'
    },
    solver: {
      type: String,
      required: [true, 'Solver wallet address is required'],
    },
    solutionDetails: {
      type: String,
      required: [true, 'Solution details are required'],
      trim: true,
    },
    imageUrls: {
      type: [String],
      default: [],
      validate: [
        {
          validator: function(v: string[]) {
            return v.length <= 5;
          },
          message: 'Maximum 5 images allowed'
        }
      ]
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    votes: {
      type: Number,
      default: 0,
    },
    voters: {
      type: [String],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Solution || mongoose.model<ISolution>('Solution', SolutionSchema);
