require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Docker = require('dockerode');
const jwt = require('jsonwebtoken');
const net = require('net');

const docker = new Docker();
const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://your-frontend-name.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// === DOCKER WEB SHELL ===
const activeContainers = new Map();

app.post('/api/webshell/start', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  try {
    const token = authHeader.split(' ')[1];
    const { teamId } = jwt.verify(token, process.env.JWT_SECRET);

    if (activeContainers.has(teamId)) {
      const old = docker.getContainer(activeContainers.get(teamId));
      await old.remove({ force: true }).catch(() => {});
    }

    const hostPort = await findFreePort();
    const container = await docker.createContainer({
      Image: 'kali-ctf-webshell',
      Tty: false,
      HostConfig: {
        PortBindings: { '8080/tcp': [{ HostPort: String(hostPort) }] },
        Memory: 512 * 1024 * 1024,
        CpuShares: 512
      }
    });

    await container.start();
    activeContainers.set(teamId, container.id);
    setTimeout(() => res.json({ url: `http://localhost:${hostPort}` }), 1000);
  } catch (err) {
    console.error('Webshell start error:', err);
    res.status(500).json({ error: 'Failed to create terminal.' });
  }
});

app.post('/api/webshell/stop', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const token = authHeader.split(' ')[1];
    const { teamId } = jwt.verify(token, process.env.JWT_SECRET);

    if (activeContainers.has(teamId)) {
      const containerId = activeContainers.get(teamId);
      const container = docker.getContainer(containerId);
      await container.remove({ force: true });
      activeContainers.delete(teamId);
      return res.json({ success: true, message: 'Terminal stopped.' });
    }
    res.json({ success: true, message: 'No active terminal.' });
  } catch (err) {
    console.error('Webshell stop error:', err);
    res.status(500).json({ error: 'Failed to stop terminal.' });
  }
});

function findFreePort() {
  return new Promise(res => {
    const server = net.createServer();
    server.listen(0, () => {
      const port = server.address().port;
      server.close(() => res(port));
    });
  });
}

app.listen(PORT, () => console.log(`Webshell service running at http://localhost:${PORT}`));