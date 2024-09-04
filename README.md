# Backend API para Gerenciamento de Produtos

Este repositório contém o backend para um sistema de gerenciamento de produtos. A API permite a criação, atualização, exclusão e consulta de produtos, além de gerenciar imagens de produtos, favoritos e avaliações. Foi desenvolvido com Node.js e utiliza MySQL como banco de dados.

## Funcionalidades

- **Gerenciamento de Produtos**: Adicionar, atualizar, deletar e listar produtos.
- **Imagens de Produtos**: Adicionar e remover imagens de produtos, incluindo uma imagem de capa(cover).
- **Favoritos**: Adicionar e remover produtos dos favoritos dos usuários.
- **Avaliações**: Adicionar e listar avaliações dos produtos feitas pelos usuários.

## Tecnologias

- Node.js
- Express.js
- MySQL

## Requisitos

- Node.js
- MySQL
- npm 

## Instalação

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/usuario/repositorio.git
    cd repositorio
    ```

2. **Instale as dependências:**

    ```bash
    npm install
    ```
3. **Inicie o servidor:**
   ```bash
   npm start
   ```
## Endpoins

## Produtos 
- **GET /api/products**: Lista todos os produtos.
- **POST /api/products**: Cria um novo produto.
- **PUT /api/products/:id**: Atualiza um produto existente.
- **DELETE /api/products/:id**: Remove um produto


### Imagens de Produtos

- **POST /api/products/product-images/post**: Adiciona uma imagem de produto.
- **DELETE /api/products/product-images/delete**: Remove uma imagem de produto.

### Favoritos

- **POST /api/products/favorites/post**: Adiciona um produto aos favoritos do usuário.
- **DELETE /api/products/favorites/delete**: Remove um produto dos favoritos do usuário.

### Avaliações

- **POST /api/products/reviews/post**: Adiciona uma avaliação de produto.
- **GET /api/products/reviews/:product_id**: Lista todas as avaliações de um produto.

## Exemplos de Requisição

### Adicionar um Produto

```http
POST /api/products
Content-Type: application/json

{
  "nome_produto": "Produto Exemplo",
  "descricao": "Descrição do produto",
  "estoque": 100,
  "data_fabricacao": "2024-08-29",
  "valor": 99.99,
  "status": "novo",
  "cat_id": 1
}
