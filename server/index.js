// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize OpenAI API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/gpt", async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).send("Prompt is required");
  }

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify the model to use
      messages: [{ role: "user", content: prompt }], // Chat-based input format
      stream: true,
    });

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(content);
      }
    }
    res.end();
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
