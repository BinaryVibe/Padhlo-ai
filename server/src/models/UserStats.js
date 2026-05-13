import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalNotesGenerated: { type: Number, default: 0 },
    totalQuizzesTaken: { type: Number, default: 0 },
    totalQuestionsAnswered: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 }, // Pura score track karne ke liye
    lastActivity: { type: Date, default: Date.now }
});

const UserStats = mongoose.model('UserStats', userStatsSchema);
export default UserStats;