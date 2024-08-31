const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_ROOT_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    return;
  }
  console.log("Conectado ao banco de dados MySQL");
});

const sqlFilePath = path.join(__dirname, "../DB/create_tables.sql");
const sql = fs.readFileSync(sqlFilePath, "utf8");

const sqlCommands = sql.split(';').filter(command => command.trim() !== '');
const totalCommands = sqlCommands.length;

let executedCommands = 0;

const executeCommand = (command, index) => {
  db.query(command, (err) => {
    if (err) {
      console.error(`Erro ao executar comando ${index + 1}:`, err.message);
      process.exit(1);
    } else {
      executedCommands++;
      const percentComplete = Math.round((executedCommands / totalCommands) * 100);
      console.log(`Progresso: ${percentComplete}% concluídos`);
      
      if (executedCommands === totalCommands) {
        console.log("Todos os comandos foram executados com sucesso!");
        // db.end();
      }
    }
  });
};

sqlCommands.forEach((command, index) => {
  executeCommand(command, index + 1);
});

module.exports = db;