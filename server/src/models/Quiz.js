import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true }, // Note se link
    title: { type: String, required: true, default: 'Generated Quiz' },
    score: { type: Number, default: 0 }, // Score save karne ke liye
    totalQuestions: { type: Number, default: 5 }
  },
  { timestamps: true }
);

quizSchema.index({ userId: 1, createdAt: -1 });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;