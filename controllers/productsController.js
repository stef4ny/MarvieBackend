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
  const { nome, descricao, estoque, valor, cat_id, status } =
    req.body;
  const sql =
    "INSERT INTO products (nome, descricao, estoque, valor, cat_id, status) VALUES (?,?,?,?,?,?)";
  const values = [
    nome,
    descricao,
    estoque,
    valor,
    cat_id,
    status,
  ];
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
  const { nome, descricao, estoque, valor, cat_id, status } =
    req.body;
  db.query(
    "UPDATE products SET nome = ?, descricao = ?, estoque = ?, valor = ?, cat_id = ?, status = ?",
    [nome, descricao, estoque, valor, cat_id, status, id],
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