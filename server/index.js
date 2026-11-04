const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'University System API is active',
        timestamp: new Date().toISOString(),
    });
});

app.get('/api/v1/system-info', (req, res) => {
    res.status(200).json({
        nodeVersion: process.version,
        uptime: Math.floor(process.uptime()),
        platform: process.platform,
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));