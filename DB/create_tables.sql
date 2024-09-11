CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  data_nascimento DATE,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  cep VARCHAR(10) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  numero VARCHAR(10),
  createdAt DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_pedido DATETIME NOT NULL,
  order_user_id INT NOT NULL,
  final_total DECIMAL(10, 2) NOT NULL,
  cart JSON
);

CREATE TABLE IF NOT EXISTS category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  estoque INT NOT NULL,
  valor FLOAT NOT NULL,
  cat_id INT NOT NULL,
  status ENUM ('Novidade', 'Últimas unidades', 'Promoção'),
  image_id JSON,
  reviews JSON,
  sizes JSON,
  colors JSON
);

CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  product_id INT NOT NULL,
  username VARCHAR(255),
  rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5),
  review VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);


INSERT INTO users (
  nome, 
  data_nascimento, 
  email, 
  senha, 
  telefone, 
  createdAt, 
  numero, 
  cep
)
SELECT 
  'Administrador',
  '2024-08-01',
  'marvieifpe@gmail.com',
  '$2b$10$Qckp/U5w8ICkPJ0EBQVMb.Qs2OY9W9QOn0oXBzpb.2tUr6h69KgVq',
  '+00 00 00000-0000',
  '2024-08-12 00:00:00',
  '0',
  '00000-000'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users);
