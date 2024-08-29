const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// const nodemailer = require("nodemailer");
const transporter = require("../config/mail")
require("dotenv").config();

exports.requestPasswordReset = (req, res) => {
  const { email } = req.body;

  db.query("SELECT id, nome FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuário:", err.message);
      return res.status(500).send(err.message);
    }

    if (results.length === 0) {
      return res.status(404).send("Usuário não encontrado");
    }

    const userId = results[0].id;
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);

    db.query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at)",
      [userId, token, expiresAt],
      (err) => {
        if (err) {
          console.error("Erro ao salvar token de recuperação:", err.message);
          return res.status(500).send(err.message);
        }

        const resetUrl = `http://localhost:5173/reset_password/${token}`;

        transporter.sendMail({
          from: `"Marvie ❄" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Recuperação de Senha",
          text: `Clique no link para redefinir sua senha: ${resetUrl}`,
          html: `<p>Clique no link para redefinir sua senha: <a href="${resetUrl}">${resetUrl}</a></p>`,
        }, (error) => {
          if (error) {
            console.error("Erro ao enviar e-mail de recuperação:", error.message);
            return res.status(500).send(error.message);
          }
          res.status(200).send("E-mail de recuperação enviado com sucesso");
        });
      }
    );
  });
};

exports.resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  db.query("SELECT user_id FROM password_resets WHERE token = ? AND expires_at > NOW()", [token], (err, results) => {
    if (err) {
      console.error("Erro ao buscar token de recuperação:", err.message);
      return res.status(500).send(err.message);
    }

    if (results.length === 0) {
      return res.status(400).send("Token inválido ou expirado");
    }

    const userId = results[0].user_id;

    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Erro ao criptografar nova senha:", err.message);
        return res.status(500).send(err.message);
      }

      db.query("UPDATE users SET senha = ? WHERE id = ?", [hashedPassword, userId], (err) => {
        if (err) {
          console.error("Erro ao atualizar senha:", err.message);
          return res.status(500).send(err.message);
        }

        db.query("DELETE FROM password_resets WHERE token = ?", [token], (err) => {
          if (err) {
            console.error("Erro ao excluir token de recuperação:", err.message);
            return res.status(500).send(err.message);
          }

          res.status(200).send("Senha redefinida com sucesso");
        });
      });
    });
  });
};
