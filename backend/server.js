import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

/* ✅ Middleware */
app.use(cors({
  origin: "*"
}));

app.use(express.json());

/* ✅ HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("Groq Backend is running 🚀");
});

/* ✅ MAIN AI ROUTE */
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
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI that answers questions based on the provided PDF context."
          },
          {
            role: "user",
            content: `Context from PDF:\n${context}\n\nQuestion:\n${question}`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    console.log("GROQ RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.json({
        answer: "Groq API error: " + (data.error?.message || "Unknown error")
      });
    }

    res.json({
      answer: data.choices?.[0]?.message?.content || "No response from AI"
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Server error"
    });
  }
});

/* ✅ START SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
