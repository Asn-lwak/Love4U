const express = require("express");
const path = require("path");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = 3000;

// =========================
// Database
// =========================

// =========================
// Middleware
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// =========================
// Routes
// =========================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api", apiRoutes);
// =========================
// Server
// =========================

app.listen(PORT, () => {
    console.log(`🚀 Love4U is running on http://localhost:${PORT}`);
});