
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false }
});

const daySchema = new mongoose.Schema({
    dayNumber: { type: Number, required: true },
    theme: { type: String, required: true }, 
    tasks: [taskSchema]
});

const roadmapSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: String, required: true },
    duration: { type: Number, required: true }, 
    topics: { type: String }, 
    days: [daySchema],
    progress: { type: Number, default: 0 } 
}, { timestamps: true });

export default mongoose.model('Roadmap', roadmapSchema);