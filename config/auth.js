const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;

async function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send("Token não fornecido");
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Token inválido");

    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyJWT;
