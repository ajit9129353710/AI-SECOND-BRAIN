const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

router.post("/test", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
    }

    if (!ai) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is missing in backend/.env",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message.trim(),
    });

    res.json({
      success: true,
      reply: response.text || "No response received.",
    });
  } catch (error) {
    console.error("Gemini API Error:", error.message);

    res.status(502).json({
      success: false,
      message: "AI request failed. Please try again.",
    });
  }
});

router.post("/ask", async (req, res) => {
  try {
    const { question, pdfText } = req.body || {};

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your question.",
      });
    }

    if (!pdfText || typeof pdfText !== "string" || !pdfText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF containing readable text.",
      });
    }

    if (pdfText.length > 20000) {
      return res.status(413).json({
        success: false,
        message:
          "PDF text is too long for this test. Please use a shorter PDF.",
      });
    }

    if (!ai) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is missing in backend/.env",
      });
    }

    const prompt = `
You are an AI assistant that answers questions about PDF documents.

Use the document text below to answer the user's question.
Explain the answer in simple language.
If the answer is not present in the document, clearly say so.
Do not invent facts.

DOCUMENT TEXT:
${pdfText}

USER QUESTION:
${question.trim()}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      question: question.trim(),
      answer: response.text || "No answer received from AI.",
    });
  } catch (error) {
    console.error("PDF Chat Error:", error.message);

    res.status(502).json({
      success: false,
      message: "Unable to answer your question. Please try again.",
    });
  }
});

module.exports = router;