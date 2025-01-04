const express = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");

const router = express.Router();

// Middleware для перевірки авторизації
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Доступ заборонено" });

  jwt.verify(token, "secretkey", (err) => {
    if (err) return res.status(403).json({ message: "Недійсний токен" });
    next();
  });
};

// Додавання товару
router.post("/", verifyToken, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// Видалення товару
router.delete("/:id", verifyToken, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Оновлення товару
router.put("/:id", verifyToken, async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});

// Отримання списку товарів
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;
