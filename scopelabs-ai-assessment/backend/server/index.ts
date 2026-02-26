import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.warn('WARNING: MONGODB_URI is not defined in .env file.');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// ==========================================
// Mongoose Schemas & Models
// ==========================================

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    affiliation: { type: String, default: null },
    job: { type: String, default: null },
    task: { type: String, default: null },
    industry: { type: String, default: null },
    age: { type: String, default: null },
    marketing: { type: Boolean, default: false }
  },
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  result: {
    categoryScores: [{
      category: String,
      score: Number,
      raw: Number,
      fullMark: Number
    }],
    totalScore: Number,
    level: String,
    comment: String,
    recommendations: [{
      category: String,
      courses: [{
        title: String,
        link: String,
        level: String,
        type: String,
        duration: String,
        desc: String
      }]
    }]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Mongoose `pre('save')` does not strictly require `next()` when passing an async function,
// but for a synchronous hook we'll just not type it or use async/await without next.
sessionSchema.pre('save', function () {
  this.updatedAt = new Date();
});

const Session = mongoose.model('Session', sessionSchema);

// ==========================================
// API Routes
// ==========================================

// 1. POST /api/diagnosis/start
app.post('/api/diagnosis/start', async (req, res) => {
  try {
    const userInfo = req.body;

    // Generate a unique session ID
    const sessionId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Process optional fields to ensure they are null instead of undefined/empty string
    const processedUserInfo = {
      name: userInfo.name,
      email: userInfo.email,
      affiliation: userInfo.affiliation || null,
      job: userInfo.job || null,
      task: userInfo.task || null,
      industry: userInfo.industry || null,
      age: userInfo.age || null,
      marketing: userInfo.marketing || false
    };

    const session = new Session({
      sessionId,
      userInfo: processedUserInfo,
      answers: {},
      status: 'in-progress'
    });

    await session.save();

    res.status(201).json({ session_id: sessionId });
  } catch (error) {
    console.error('Error starting diagnosis:', error);
    res.status(500).json({ error: 'Internal server error', details: error.toString() });
  }
});


// 2. PUT /api/diagnosis/progress
app.put('/api/diagnosis/progress', async (req, res) => {
  try {
    const { session_id, question_id, answer_value } = req.body;

    if (!session_id || question_id === undefined || answer_value === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find the session and update the specific answer
    const session = await Session.findOne({ sessionId: session_id });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Update the answers map
    session.answers.set(question_id.toString(), answer_value);
    await session.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// 3. POST /api/diagnosis/submit
// For calculation, we need access to the questions and recommendations data.
// In a real app, this might be imported or fetched from a DB.
// Since it's currently hardcoded in the frontend, we will let the frontend calculate the result and pass it during submit,
// OR we can replicate the calculation here. Let's accept the calculated result from the frontend to keep it perfectly synced.
app.post('/api/diagnosis/submit', async (req, res) => {
  try {
    const { session_id, result_data } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: 'Missing session_id' });
    }

    const session = await Session.findOne({ sessionId: session_id });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.status = 'completed';

    if (result_data) {
      session.result = result_data;
    }

    await session.save();

    // The frontend expects the response to match the spec
    res.status(200).json({
      success: true,
      data: session.result
    });
  } catch (error) {
    console.error('Error submitting diagnosis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
