const db = require("../config/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");
const SECRET = process.env.JWT_SECRET;

exports.getUsers = (req, res) => {
  db.query('SELECT * FROM users WHERE id != 1', (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results);
  });
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT id, senha, nome FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuário:", err.message);
      return res.status(500).send(err.message);
    }

    if (results.length === 0) {
      return res.status(401).send("Usuário não encontrado");
    }

    const hashedPassword = results[0].senha;
    const userId = results[0].id;
    const userName = results[0].nome;

    bcrypt.compare(senha, hashedPassword, (err, isMatch) => {
      if (err) {
        console.error("Erro ao comparar senhas:", err.message);
        return res.status(500).send(err.message);
      }

      if (isMatch) {
        const token = jwt.sign({ userId }, SECRET, { expiresIn: "1h" });
        const expiresAt = moment().add(1, 'hour').toDate();

        const insertTokenSql = "INSERT INTO tokens (user_id, token, expires_at) VALUES (?, ?, ?)";
        db.query(insertTokenSql, [userId, token, expiresAt], (err) => {
          if (err) {
            console.error("Erro ao armazenar token:", err.message);
            return res.status(500).send(err.message);
          }

          return res.json({ auth: true, token, userName });
        });
      } else {
        return res.status(401).send("Senha incorreta");
      }
    });
  });
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;

  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuário:", err.message);
      return res.status(500).send(err.message);
    }

    if (results.length === 0) {
      return res.status(404).send("Usuário não encontrado");
    }

    res.json(results[0]);
  });
};

exports.getUserNameByToken = (req, res) => {
  const userId = req.userId;

  const sql = "SELECT nome FROM users WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar nome do usuário:", err.message);
      return res.status(500).send(err.message);
    }

    if (results.length === 0) {
      return res.status(404).send("Usuário não encontrado");
    }

    const userName = results[0].nome;
    res.json({ userName });
  });
};

exports.createUser = (req, res) => {
  const { nome, email, senha, nascimento, telefone, CEP, createdAt, numero } = req.body;

  bcrypt.hash(senha, saltRounds, (err, hash) => {
    if (err) {
      console.error("Erro ao criptografar a senha:", err.message);
      res.status(500).send(err.message);
      return;
    }

    const sql = 'INSERT INTO users (nome, email, senha, data_nascimento, telefone, cep, createdAt, numero) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [nome, email, hash, nascimento, telefone, CEP, createdAt, numero];
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Erro ao inserir usuário:", err.message);
        res.status(500).send(err.message);
        return;
      }
      res.status(201).json({ id: result.insertId });
    });
  });
};