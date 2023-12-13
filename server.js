const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON data
app.use(express.static('public'));

function scanPort(host, port) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    socket.setTimeout(1000); // Set timeout for connection attempt

    socket.on('connect', () => {
      socket.destroy();
      resolve(port);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(); // Resolve without a port for closed port
    });

    socket.on('error', (error) => {
      socket.destroy();
      resolve(); // Resolve without a port for error
    });

    socket.connect(port, host);
  });
}

async function scanPorts(host, startPort, endPort) {
  const openPorts = [];

  for (let port = startPort; port <= endPort; port++) {
    const result = await scanPort(host, port);
    if (result) {
      openPorts.push(result);
    }
  }

  return openPorts;
}

app.post('/scan-ports', async (req, res) => {
  const { host, startPort, endPort } = req.body;

  try {
    const openPorts = await scanPorts(host, startPort, endPort);
    res.json({ openPorts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
