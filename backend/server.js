import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Groq backend running 🚀");
});

app.post("/ask", async (req, res) => {
  try {
    const { question, context } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "system",
      content: "Answer based on PDF context only."
    },
    {
      role: "user",
      content: `Context:\n${context}\n\nQuestion:\n${question}`
    }
  ]
})
    });

    const data = await response.json();

    if (!response.ok) {
      return res.json({
        answer: "Groq error: " + (data.error?.message || "Unknown error")
      });
    }

    res.json({
      answer: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
