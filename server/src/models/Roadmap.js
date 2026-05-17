
import mongoose from 'mongoose';

// Task ka chota schema (Din ke andar kya karna hai)
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false }
});

// Day ka schema (Us din ka kya plan hai)
const daySchema = new mongoose.Schema({
    dayNumber: { type: Number, required: true },
    theme: { type: String, required: true }, // Jaise: "Basic Concepts"
    tasks: [taskSchema]
});

// Main Roadmap schema (Poora Plan)
const roadmapSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: String, required: true },
    duration: { type: Number, required: true }, // Kitne din ka plan hai
    topics: { type: String }, // User ne kya extra topics likhe hain
    days: [daySchema],
    progress: { type: Number, default: 0 } // Percentage (0 se 100 tak)
}, { timestamps: true });

export default mongoose.model('Roadmap', roadmapSchema);