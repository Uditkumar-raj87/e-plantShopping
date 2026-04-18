import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

const dbPath = path.resolve("server/data/db.json");

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(
    dbPath,
    JSON.stringify({ users: [], orders: [], nextUserId: 1, nextOrderId: 1 }, null, 2)
  );
}

const readDb = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const writeDb = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: "7d"
  });
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "").trim();

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (_error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }

  const db = readDb();
  const existingUser = db.users.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    res.status(409).json({ message: "User already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: db.nextUserId,
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  db.nextUserId += 1;
  db.users.push(newUser);
  writeDb(db);

  const token = signToken(newUser);
  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const db = readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = signToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get("/api/auth/me", auth, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.user.id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post("/api/payment/create-intent", auth, async (req, res) => {
  const { amount, currency = "usd", paymentMethod = "card" } = req.body;

  if (!amount || Number(amount) <= 0) {
    res.status(400).json({ message: "A valid amount is required" });
    return;
  }

  if (paymentMethod !== "card") {
    res.json({ provider: "manual", clientSecret: "manual-confirmation" });
    return;
  }

  if (!stripe) {
    res.json({ provider: "stripe-mock", clientSecret: "mock_client_secret" });
    return;
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      automatic_payment_methods: { enabled: true }
    });

    res.json({ provider: "stripe", clientSecret: intent.client_secret });
  } catch (_error) {
    res.status(500).json({ message: "Failed to create payment intent" });
  }
});

app.post("/api/orders", auth, (req, res) => {
  const { items, totals, shipping, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: "Order items are required" });
    return;
  }

  const db = readDb();

  const order = {
    id: db.nextOrderId,
    userId: req.user.id,
    items,
    totals,
    shipping,
    paymentMethod,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  db.nextOrderId += 1;
  db.orders.push(order);
  writeDb(db);

  res.status(201).json({ order });
});

app.get("/api/orders", auth, (req, res) => {
  const db = readDb();
  const orders = db.orders
    .filter((order) => order.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ orders });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
