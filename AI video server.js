const express = require('express');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Generate Video API
app.post('/generate', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send("Text is required!");

  const videoId = Date.now();
  const outputPath = path.join(__dirname, 'public', `${videoId}.mp4`);

  // Call Python AI Script
  PythonShell.run(
    path.join(__dirname, '../ai/video_gen.py'),
    {
      args: ['--text', text, '--output', outputPath],
    },
    (err) => {
      if (err) {
        console.error("AI Error:", err);
        return res.status(500).send("Failed to generate video.");
      }
      res.json({ videoPath: `${videoId}.mp4` });
    }
  );
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
