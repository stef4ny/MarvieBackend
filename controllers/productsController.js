const db = require("../config/db");

exports.getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results);
  });
};

exports.getProductById = (req, res) => {
  const userId = req.params.id;

  db.query("SELECT * FROM products WHERE id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results);
  });
};

exports.createProduct = (req, res) => {
  const { nome, descricao, estoque, valor, cat_id, status, image_id } = req.body;
  const imageIdJson = Array.isArray(image_id) ? JSON.stringify(image_id) : image_id;
  const sql =
    "INSERT INTO products (nome, descricao, estoque, valor, cat_id, status, image_id) VALUES (?,?,?,?,?,?,?)";
  const values = [nome, descricao, estoque, valor, cat_id, status, imageIdJson];
  db.query(sql, values, (err, results) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(201).json({ id: results.insertID });
  });
};

exports.putProduct = (req, res) => {
  const id = req.params.id;
  const { nome, descricao, estoque, valor, cat_id, status, image_id } = req.body;
  
  const imageIdJson = Array.isArray(image_id) ? JSON.stringify(image_id) : image_id;

  db.query(
    "UPDATE products SET nome = ?, descricao = ?, estoque = ?, valor = ?, cat_id = ?, status = ?, image_id = ? WHERE id = ?",
    [nome, descricao, estoque, valor, cat_id, status, imageIdJson, id],
    (err, results) => {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send("Produto não encontrado");
        return;
      }
      res.sendStatus(204);
    }
  );
};

exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM products WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send("Produto não encontrado");
      return;
    }
    res.sendStatus(204);
  });
};

exports.getTotalOrders = (req, res) => {
  db.query("SELECT COUNT(*) AS totalOrders FROM orders", (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results[0]);
  });
};

exports.getTotalProducts = (req, res) => {
  db.query("SELECT COUNT(*) AS totalProducts FROM products", (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results[0]);
  });
};

exports.getTotalUsers = (req, res) => {
  db.query("SELECT COUNT(*) AS totalClients FROM users", (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results[0]);
  });
};

exports.getOutOfStockProducts = (req, res) => {
  db.query("SELECT * FROM products WHERE estoque = 0", (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results);
  });
