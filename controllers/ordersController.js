const db = require("../config/db");

exports.getOrders = (req, res) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results);
  });
};

exports.getOrdersById = (req, res) => {
  const userId = req.params.id;

  const sql = "SELECT * FROM orders WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar pedido:", err.message);
      return res.status(500).send(err.message);
    }

    if (results.length === 0) {
      return res.status(404).send("Pedido não encontrado");
    }

    res.json(results[0]);
  });
}

 exports.createOrders = (req,res) => {
    const {data_pedido,ped_usu_id} = req.body;
    const sql = 'INSERT INTO requests (data_pedido, ped_usu_id) VALUES (?,?)';
    const values = [data_pedido,ped_usu_id];
  
    db.query(sql, values, (err,result) => {
          if(err){
            console.error('Erro ao inserir pedido:', err.message);
            return;
          }
          res.status(201).json({id: result.insertId});
    });
  }

exports.putOrders =  (req, res) => {
    const id = req.params.id;
    const {data_pedido,ped_usu_id} = req.body;
    db.query('UPADATE requests SET data_pedido = ?, ped_usu_id = ?', [data_pedido,ped_usu_id,id], (err,result) => {
        if(err){
          res.status(500).send(err.message);
          return;
        }
        if(result.affectedRows === 0){
          res.status(404).send('Pedido não encontrado');
          return;
        }
        res.sendStatus(204);
    });
  };

exports.deleteOrders = (req, res) =>{
    const id = req.params.id;
    db.query('DELETE FROM requests WHERE id = ?', [id], (err, result) => {
      if(err){
        res.status(500).send(err.message);
        return;
      }
      if(result.affectedRows === 0){
        res.status(404).send('Pedido não encontrado');
        return;
      }
      res.sendStatus(204);
    })
  }

exports.putOreders =  (req, res) =>{
  const {pedido_id, produto_id} = req.params;
  const {quantidade} = req.body;
  const sql = 'UPDATE requests_products SET quantidade = ? WHERE pedido_id = ? AND produto_id = ?';

  db.query(sql, [quantidade, pedido_id, produto_id], (err, result) => {
    if(err){
      res.status(500).send(err.message);
      return;
    }
    if(result.affectedRows === 0){
      res.status(404).send('Item não encontrado');
      return;
    }
    res.sendStatus(204);
  });
};