const db = require("../config/db");

exports.getReviewsByProductId = (req, res) => {
  const productId = req.params.productId;

  db.query("SELECT * FROM reviews WHERE product_id = ?", [productId], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results);
  });
};

exports.getReviewById = (req, res) => {
  const reviewId = req.params.id;

  db.query("SELECT * FROM reviews WHERE id = ?", [reviewId], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (results.length === 0) {
      return res.status(404).send("Review não encontrada");
    }
    res.json(results[0]);
  });
};

exports.createReview = (req, res) => {
  const id = req.params.id;
  const { username, rating, review } = req.body;
  
  const sql =
    "INSERT INTO reviews (username, product_id, rating, review) VALUES (?, ?, ?, ?)";
  const values = [username, id, rating, review];
  
  db.query(sql, values, (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).json({ id: results.insertId });
  });
};

exports.deleteReview = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM reviews WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Review não encontrada");
    }
    res.sendStatus(204);
  });
};