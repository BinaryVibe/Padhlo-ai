import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      }
    ],
    correctAnswer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexing by quizId so pulling all questions for a specific quiz is instant
questionSchema.index({ quizId: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;