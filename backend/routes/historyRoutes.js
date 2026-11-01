const express = require("express");
const jwt = require("jsonwebtoken");
const ChatHistory = require("../models/ChatHistory");

const router = express.Router();

function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
}

router.post("/save", verifyToken, async (req, res) => {
  try {
    const { question, answer, pdfName } = req.body;

    if (
      typeof question !== "string" ||
      !question.trim() ||
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required.",
      });
    }

    const history = await ChatHistory.create({
      userId: req.userId,
      question: question.trim(),
      answer: answer.trim(),
      pdfName:
        typeof pdfName === "string" && pdfName.trim()
          ? pdfName.trim()
          : "My PDF",
    });

    return res.status(201).json({
      success: true,
      message: "Chat saved successfully!",
      history,
    });
  } catch (error) {
    console.error("Save History Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save chat history.",
    });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const history = await ChatHistory.find({
      userId: req.userId,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Get History Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch chat history.",
    });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const mongoose = require("mongoose");

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid history ID.",
      });
    }

    const deleted = await ChatHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Chat history not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat history deleted successfully.",
    });
  } catch (error) {
    console.error("Delete History Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete chat history.",
    });
  }
});

module.exports = router;