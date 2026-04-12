import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: userMessage }
    ]
  })
});

const data = await response.json();

console.log("OPENAI FULL RESPONSE:", JSON.stringify(data, null, 2));

if (!response.ok) {
  return res.json({
    reply: "OpenAI error: " + data.error?.message
  });
}

res.json({
  reply: data.choices?.[0]?.message?.content || "No content returned"
});

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
