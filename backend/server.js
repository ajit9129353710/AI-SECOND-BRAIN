const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ajit-t8ig-61qfaphji-ctrl-z1.vercel.app"
  ],
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
res.send("AI Second Brain Backend is Running!");
});

app.get("/api/health", (req, res) => {
res.json({
success: true,
message: "Backend is running"
});
});

app.use((req, res) => {
res.status(404).json({
success: false,
message: "Route not found"
});
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
try {
await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

} catch (error) {
console.error("Unable to start server:", error.message);
process.exit(1);
}
};

startServer();