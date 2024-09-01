const db = require("../config/db");

exports.getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results);
  });

  exports.createProduct = (req, res) => {
    const { nome, descricao, estoque, data_fabricacao, valor, cat_id, status } =
      req.body;
    const sql =
      "INSERT INTO products (nome, descricao, estoque, data_fabricacao, valor, cat_id, status) VALUES (?,?,?,?,?,?,?)";
    const values = [
      nome,
      descricao,
      estoque,
      data_fabricacao,
      valor,
      cat_id,
      status,
    ];
    sql.query(values, (err, results) => {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      res.status(201).json({ id: results.insertID });
    });
  };
};

exports.putProducts = (req, res) => {
  const id = req.params.id;
  const { nome, descricao, estoque, data_fabricacao, valor, cat_id, status } =
    req.body;
  db.query(
    "UPDATE products SET nome = ?, descricao = ?, estoque = ?, data_fabricacao = ?, valor = ?, cat_id = ?, status = ?",
    [nome, descricao, estoque, data_fabricacao, valor, cat_id, status, id],
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

exports.delete = (req, res) => {
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

exports.postFavorite = (req, res) => {
  const { user_id, product_id } = req.body;
  const sql = "INSERT INTO favorites(user_id, product_id) VALUES (?,?)";
  db.query(sql, [user_id, product_id], (err, results) => {
    if (err) {
      return res.status(500).send(err.massage);
    }
    res.status(201).json({ id: results.insertId });
  });
};

exports.deleteFavorite = (req, res) => {
  const { user_id, product_id } = req.body;
  const sql = "DELETE FROM favorites WHERE user_id = ? AND product_id = ?";
  db.query(sql, [user_id, product_id], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.sendStatus(204);
  });
};

exports.postReviews = (req, res) => {
  const { product_id, user_id, rating } = req.body;
  const sql =
    "INSERT INTO reviewws (product_id, user_id, rating) VALUES (?,?,?)";

  if (rating <= 1 || rating >= 5) {
    return res.status(400).send("Avaliação deve ser entre 1 e 5");
  }
  db.query(sql, [product_id, user_id, rating], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).json({ id: results.insertId });
  });
};
exports.getReviews = (req, res) => {
  const { product_id } = req.params;
  const sql = "SELECT * FROM reviews WHERE product_id = ?";
  db.query(sql, [product_id], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results);
  });
};
