const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.NODEJS_PORT || 3000;

const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/productsRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");
const connectRoutes = require("./routes/connectRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.use("/users", usersRoutes);
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/password_reset", passwordResetRoutes);
app.use("/connected", connectRoutes);
app.use("/token", tokenRoutes);
app.use("/reviews", reviewsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});