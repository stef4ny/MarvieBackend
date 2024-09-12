const db = require("../config/db");
const { createUserFromOrder } = require("./usersController");
const crypto = require("crypto");
const transporter = require("../config/mail");
const { loginWithOrder } = require("./usersController");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

exports.getOrders = (req, res) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Token não fornecido");
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      console.error("Erro ao verificar o token:", err.message);
      return res.status(401).send("Token inválido");
    }

    const userId = decoded.userId;

    if (userId === 1) {
      db.query("SELECT * FROM orders", (err, results) => {
        if (err) {
          console.error("Erro ao buscar pedidos:", err.message);
          return res.status(500).send(err.message);
        }
        res.json(results);
      });
    } else {
      const sql = "SELECT * FROM orders WHERE order_user_id = ?";
      db.query(sql, [userId], (err, results) => {
        if (err) {
          console.error("Erro ao buscar pedidos:", err.message);
          return res.status(500).send(err.message);
        }
        res.json(results);
      });
    }
  });
};

exports.getOrdersById = (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("Token não fornecido");
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      console.error("Erro ao verificar o token:", err.message);
      return res.status(401).send("Token inválido");
    }

    const userId = decoded.userId;
    const orderId = req.params.id;

    let sql;
    let params;

    if (userId === 1) {
      sql = "SELECT * FROM orders WHERE id = ?";
      params = [orderId];
    } else {
      sql = "SELECT * FROM orders WHERE id = ? AND order_user_id = ?";
      params = [orderId, userId];
    }

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Erro ao buscar pedido:", err.message);
        return res.status(500).send(err.message);
      }

      if (results.length === 0) {
        return res.status(404).send("Pedido não encontrado");
      }

      res.json(results[0]);
    });
  });
};

exports.createOrders = (req, res) => {
  const { cartItems, data, finalTotal, status } = req.body;

  function generateRandomPassword(length = 8) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .slice(0, length);
  }
  const randomPassword = generateRandomPassword(8);
  const userData = {
    nome: `${data.firstName} ${data.lastName}`,
    email: data.email,
    senha: randomPassword,
    CEP: data.zip,
    createdAt: new Date(),
  };

  createUserFromOrder({ body: userData }, res, (err, userId) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao criar usuário." });
    }

    const cartItemsJson = JSON.stringify(cartItems);

    const sql = `
      INSERT INTO orders (data_pedido, cart, final_total, order_user_id, status)
      VALUES (NOW(), ?, ?, ?, ?)
    `;

    const values = [cartItemsJson, finalTotal, userId, status];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Erro ao inserir pedido:", err.message);
        return res.status(500).json({ error: "Erro ao criar pedido." });
      }

      transporter.sendMail(
        {
          from: `"Marvie ❄" <${process.env.EMAIL_USER}>`,
          to: data.email,
          subject: `Pedido de ${data.firstName}`,
          text: `Sua senha para visualizar seus pedidos: ${randomPassword}`,
          html: `<p>Sua senha para visualizar seus pedidos: ${randomPassword}</p>`,
        },
        (error) => {
          if (error) {
            console.error("Erro ao enviar senha:", error.message);
            return res.status(500).send(error.message);
          }
          // res.status(200).send("Senha enviada com sucesso");
          const loginData = {
            email: userData.email,
            senha: userData.senha,
          };

          loginWithOrder(loginData, (err, token, userName) => {
            if (err) {
              return res.status(500).json({ error: "Erro ao fazer login." });
            }

            return res.json({ orderId: result.insertId, token, userName });
          });
        }
      );

      // res.status(201).json({ orderId: result.insertId, userId: userId });
    });
  });
};

exports.deleteOrders = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM orders WHERE id = ?", [id], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send("Pedido não encontrado");
      return;
    }
    res.sendStatus(204);
  });
};

exports.putOrders = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).send("Pedido não encontrado");
        return;
      }
      res.sendStatus(204);
    }
  );
};
