import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // A user should only ever have ONE stats document
    },
    totalQuizzesTaken: {
      type: Number,
      default: 0,
    },
    totalQuestionsAnswered: {
      type: Number,
      default: 0,
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

const UserStats = mongoose.model('UserStats', userStatsSchema);

export default UserStats;