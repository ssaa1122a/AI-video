const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = 3000;

// Setup OpenAI API
const configuration = new Configuration({
  apiKey: 'YOUR_OPENAI_API_KEY', // <-- Replace with your real key
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(express.static('public'));

// API Endpoint
app.post('/generate-story', async (req, res) => {
  const { keyword } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Create a fun, short story for kids using the word: "${keyword}". Make it imaginative and child-friendly.`,
        },
      ],
    });
    const story = completion.data.choices[0].message.content;
    res.json({ story });
  } catch (error) {
    console.error(error);
    res.status(500).send('Story generation failed.');
  }
});

// HTML UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
