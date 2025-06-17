const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express(); // ✅ Declarar primero

app.use(cors());
app.use(express.json());

const pedidoRoutes = require('./routes/pedido.routes');
app.use('/api/pedidos', pedidoRoutes); // ✅ Ahora está en el lugar correcto

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Order-service corriendo en el puerto ${PORT}`);
});

