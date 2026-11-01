const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum 10 MB
  },

  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" &&
      file.originalname.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

router.post("/upload", (req, res) => {
  upload.single("pdf")(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF file.",
      });
    }

    try {
      const pdfData = await pdfParse(req.file.buffer);

      const extractedText = pdfData.text
        ? pdfData.text.trim()
        : "";

      if (!extractedText) {
        return res.status(400).json({
          success: false,
          message:
            "No readable text found. This PDF may contain scanned images.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "PDF uploaded and processed successfully!",
        fileName: req.file.originalname,
        pages: pdfData.numpages,
        text: extractedText,
      });
    } catch (err) {
      console.error("PDF Processing Error:", err.message);

      return res.status(500).json({
        success: false,
        message: "Unable to read this PDF. Please try another file.",
      });
    }
  });
});

module.exports = router;