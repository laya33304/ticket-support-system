const express = require("express");
const db = require("./config/db");
require("dotenv").config();

const app = express();
const portNum = process.env.PORT || 3000;
app.use(express.json());
const cors = require("cors");
app.use(cors());

const userRoutes = require("./routes/userRoutes.js");
const ticketRoutes = require("./routes/ticketRoutes");
const commentRoutes = require("./routes/commentRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes.js");

app.get("/", (req, res) => {
  res.send("Support Ticket API");
});

app.get("/test-db", async (req, res, next) => {
  try {
    const [rows] = await db.execute("SELECT 1 AS result");

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", commentRoutes);
app.use("/api/auth", authRoutes);
app.use(errorMiddleware);

app.listen(portNum, () => {
  console.log(`Server running on port ${portNum}`);
});
