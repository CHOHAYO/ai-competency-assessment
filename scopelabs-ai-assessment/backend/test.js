import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

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
                type: Map,
                of: Number,
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

        const Session = mongoose.model('Session', sessionSchema);

        try {
            const session = new Session({
                sessionId: 'test_' + Date.now(),
                userInfo: {
                    name: 'Test',
                    email: 'test@email.com',
                    affiliation: null,
                    job: null,
                    task: null,
                    industry: null,
                    age: null,
                    marketing: false
                },
                answers: {},
                status: 'in-progress'
            });

            await session.save();
            console.log('Saved successfully');
        } catch (e) {
            console.error('Validation error:', e);
        }

        mongoose.disconnect();
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));
