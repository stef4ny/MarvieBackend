const db = require("../config/db");

exports.verifyToken = (req, res) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Token não fornecido");
  }

  const sql = `
  SELECT tokens.token, tokens.expires_at, users.id, users.nome
  FROM tokens
  JOIN users ON tokens.user_id = users.id
  WHERE tokens.token = ?;
`;
  db.query(sql, [token], (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuário:", err.message);
      return res.status(500).send(err.message);
    }

    if (results.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const user = results[0];
    return res.status(200).json({
      userName: user.nome
    });
  });
};