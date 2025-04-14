require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const User = require("./models/User");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Fix: Ensure MongoDB connection happens BEFORE starting the server
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/carrental", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ✅ Fix: Ensure SECRET_KEY is always set
const sessionSecret = process.env.SECRET_KEY || "your_default_secret";

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Fix: Use session only once (remove duplicate)
app.use(session({
    secret: sessionSecret, 
    resave: false,
    saveUninitialized: true
}));

const cars = [
    { name: "Swift", price: "₹2000/day", image: "/images/Swift.jpg" },
    { name: "Swift Desire", price: "₹3000/day", image: "/images/Swift Desire.jpg" },
    { name: "Creta", price: "₹3500/day", image: "/images/Creata.jpg" },
    { name: "Brezza", price: "₹4000/day", image: "/images/Brezz.jpg" },
    { name: "Thar", price: "₹4500/day", image: "/images/Thar.jpg" },
    { name: "Scorpio N", price: "₹5000/day", image: "/images/Scorpio N.jpg" },
    { name: "Scorpio S11 Classic", price: "₹5500/day", image: "/images/Scorpio S11.jpg" },
    { name: "Fortuner", price: "₹7000/day", image: "/images/Fortuner.jpg" }
];
app.get('/', (req, res) => {
    res.render('index', { cars: cars });  // Ensure 'cars' is passed
});


// Routes
app.get("/", (req, res) => res.render("index", { user: req.session.user }));

app.get("/signup", (req, res) => res.render("signup"));
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.send("❌ Email already exists.");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.redirect("/login");
});

app.get("/login", (req, res) => res.render("login"));
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send("❌ User not found.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("❌ Invalid credentials.");

    req.session.user = user;
    res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("dashboard", { user: req.session.user });
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});

// ✅ Fix: Start the server AFTER all middleware is set
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
