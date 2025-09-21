require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const Team = require('./models/Team');
const Challenge = require('./models/Challenge');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ctf-01.vercel.app',
    'https://ctf-01-b8hd6bsxi-aditemp01s-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

app.use('/files', express.static(path.join(__dirname, 'public','files')));

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully.');
    
    // Initialize database with challenges and test users
    await initializeDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize database with sample data
const initializeDatabase = async () => {
  try {
    // Check if challenges exist
    const challengeCount = await Challenge.countDocuments();
    if (challengeCount === 0) {
      console.log('Seeding challenges...');
      const challenges = [
        {
          challengeId: 1,
          name: 'Initiation Rite',
          description: 'M2 has linked up with Nisbot\'s command center. Before we can proceed, we need to bring you, our third teammate, online. Run the initiation program to establish the link.',
          category: 'General',
          difficulty: 'Welcome',
          points: 0,
          flag: 'flag{w3lc0me_t0_th3_r3scu3_m1ss10n}',
          downloadFile: 'initiate',
          position: { top: '25%', left: '65%' }
        },
        {
          challengeId: 2,
          name: 'Ghost in the Drive',
          description: 'M1 wiped the ship\'s logs to cover its tracks! The data might still be lingering on this damaged drive image. Find the deleted log file to uncover M1\'s next move.',
          category: 'Forensics',
          difficulty: 'Easy',
          points: 25,
          flag: 'flag{d3l3t3d_d4t4_n3v3r_d13s}',
          downloadFile: 'usb_drive.dd.vhd',
          position: { top: '45%', left: '70%' }
        },
        {
          challengeId: 3,
          name: 'Unfiltered Ping',
          description: 'The logs point to this basic Network Diagnostic Tool. It\'s our only way into M1\'s command server. It looks simple... maybe too simple.',
          category: 'Web Security',
          difficulty: 'Medium',
          points: 100,
          flag: 'flag{n3v3r_tru5t_u53r_1nput}',
          downloadFile: '',
          position: { top: '65%', left: '80%' }
        },
        {
          challengeId: 4,
          name: 'The Cookie Jar',
          description: 'While exploring the server, you found a secondary login portal. Access is controlled by a session cookie. M1 seems to think nobody would check what\'s inside the cookie jar.',
          category: 'Web Security',
          difficulty: 'Medium',
          points: 100,
          flag: 'flag{h1dd3n_1n_pl41n_s1ght}',
          downloadFile: '',
          position: { top: '80%', left: '72%' }
        }
      ];
      
      await Challenge.insertMany(challenges);
      console.log('Challenges seeded successfully!');
    }

    // Check if test users exist
    const userCount = await Team.countDocuments();
    if (userCount === 0) {
      console.log('Creating test users...');
      const testUsers = [
        { username: 'test', password: 'test123' },
        { username: 'admin', password: 'admin123' },
        { username: 'demo', password: 'demo123' }
      ];

      for (const userData of testUsers) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        await Team.create({
          username: userData.username,
          password: hashedPassword,
          score: 0,
          solvedChallenges: [],
          submissions: []
        });
      }
      console.log('Test users created successfully!');
      console.log('Login credentials:');
      console.log('- Username: test, Password: test123');
      console.log('- Username: admin, Password: admin123');
      console.log('- Username: demo, Password: demo123');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// === HEALTH CHECK ===
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// === AUTH ===
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const team = await Team.findOne({ username });
    if (!team) return res.status(401).json({ success: false, message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, team.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid username or password' });

    const payload = { teamId: team._id, username: team.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// === MAP DATA ===
app.get('/api/map-data', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const challenges = await Challenge.find({}).select('-flag');

    if (!authHeader) {
      return res.json({ success: true, challenges, solvedChallengeIds: [], attemptsMap: {} });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const team = await Team.findById(decoded.teamId).populate('solvedChallenges.challenge');

    const solvedChallengeIds = team
      ? team.solvedChallenges.map(s => s.challenge.challengeId)
      : [];
    const attemptsMap = {};
    if (team && team.submissions) {
      const allChallenges = await Challenge.find({});
      team.submissions.forEach(sub => {
        const ch = allChallenges.find(c => c._id.equals(sub.challenge));
        if (ch) attemptsMap[ch.challengeId] = sub.count;
      });
    }

    res.json({ success: true, challenges, solvedChallengeIds, attemptsMap });
  } catch (err) {
    console.error('Map data error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// === SINGLE CHALLENGE ===
app.get('/api/challenge/:challengeId', async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ challengeId: req.params.challengeId }).select('-flag');
    if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found' });
    res.json({ success: true, challenge, publicApiUrl: process.env.PUBLIC_API_URL });
  } catch (err) {
    console.error('Single challenge error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// === FLAG SUBMIT ===
// • adds points directly to Team.score
// • pushes solved challenge with timestamp
app.post('/api/challenge/submit', async (req, res) => {
  try {
    const { challengeId, flag } = req.body;
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const team = await Team.findById(decoded.teamId);
    const challenge = await Challenge.findOne({ challengeId }).select('+flag');
    if (!team || !challenge) {
      return res.status(404).json({ success: false, message: 'Team or Challenge not found' });
    }

    const alreadySolved = team.solvedChallenges.some(s => s.challenge.equals(challenge._id));
    if (alreadySolved) {
      return res.json({ success: true, message: 'Already solved!' });
    }

    if (flag === challenge.flag) {
      // ✅ directly add points & store timestamp in DB
      team.score += challenge.points;
      team.solvedChallenges.push({ challenge: challenge._id, timestamp: new Date() });
      await team.save();
      return res.json({ success: true, message: 'Flag Captured!' });
    }

    // record submission attempts
    const sub = team.submissions.find(s => s.challenge.equals(challenge._id));
    sub ? sub.count++ : team.submissions.push({ challenge: challenge._id, count: 1 });
    await team.save();

    res.json({ success: false, message: 'Incorrect Flag!' });
  } catch (err) {
    console.error('Flag submit error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// === LEADERBOARD ===
app.get('/api/leaderboard', async (req, res) => {
  try {
    const teams = await Team.find({})
      .select('username score')
      .sort({ score: -1 })
      .limit(10);
    
    res.json({ success: true, leaderboard: teams });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
