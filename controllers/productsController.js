const db = require("../config/db");

exports.getProducts = (req, res) => {
  db.query(
    "SELECT p.*, JSON_ARRAYAGG(r.rating) AS ratings FROM products p LEFT JOIN reviews r ON p.id = r.product_id GROUP BY p.id",
    (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json(results); 
    }
  );
};

exports.getProductById = (req, res) => {
  const productId = req.params.id;

  db.query(
    "SELECT p.*, JSON_ARRAYAGG(r.rating) AS ratings FROM products p LEFT JOIN reviews r ON p.id = r.product_id WHERE p.id = ? GROUP BY p.id",
    [productId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (results.length === 0) {
        return res.status(404).send("Produto não encontrado");
      }
      res.json(results[0]);
    }
  );
};

exports.createProduct = (req, res) => {
  const {
    nome,
    descricao,
    estoque,
    valor,
    cat_id,
    status,
    image_id,
    sizes,
    colors,
  } = req.body;

  const imageIdJson = Array.isArray(image_id) ? JSON.stringify(image_id) : image_id;
  const sizesJson = Array.isArray(sizes) ? JSON.stringify(sizes) : sizes;
  const colorsJson = Array.isArray(colors) ? JSON.stringify(colors) : colors;

  const sql = "INSERT INTO products (nome, descricao, estoque, valor, cat_id, status, image_id, sizes, colors) VALUES (?,?,?,?,?,?,?,?,?)";
  const values = [nome, descricao, estoque, valor, cat_id, status, imageIdJson, sizesJson, colorsJson];

  db.query(sql, values, (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).json({ id: results.insertId });
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
        return res.status(500).send(err.message);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("Produto não encontrado");
      }
      res.sendStatus(204);
    }
  );
};

exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM products WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Produto não encontrado");
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
};

