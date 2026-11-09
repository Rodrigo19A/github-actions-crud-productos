
const express = require('express');

function createApp() {
  const app = express();
  const productos = [];
  let siguienteId = 1;

  app.use(express.json());

  function datosValidos(nombre, precio) {
    return (
      typeof nombre === 'string' &&
      nombre.trim().length > 0 &&
      typeof precio === 'number' &&
      Number.isFinite(precio) &&
      precio >= 0
    );
  }

  // Listar productos
  app.get('/productos', (req, res) => {
    res.status(200).json(productos);
  });

  // Buscar producto por ID
  app.get('/productos/:id', (req, res) => {
    const producto = productos.find(
      p => p.id === Number(req.params.id)
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    res.status(200).json(producto);
  });

  // Crear producto
  app.post('/productos', (req, res) => {
    const { nombre, precio } = req.body;

    if (!datosValidos(nombre, precio)) {
      return res.status(400).json({
        mensaje: 'Nombre o precio invalido'
      });
    }

    const nuevoProducto = {
      id: siguienteId++,
      nombre: nombre.trim(),
      precio
    };

    productos.push(nuevoProducto);

    res.status(201).json(nuevoProducto);
  });

  // Actualizar producto
  app.put('/productos/:id', (req, res) => {
    const producto = productos.find(
      p => p.id === Number(req.params.id)
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    const { nombre, precio } = req.body;

    if (!datosValidos(nombre, precio)) {
      return res.status(400).json({
        mensaje: 'Nombre o precio invalido'
      });
    }

    producto.nombre = nombre.trim();
    producto.precio = precio;

    res.status(200).json(producto);
  });

  // Eliminar producto
  app.delete('/productos/:id', (req, res) => {
    const indice = productos.findIndex(
      p => p.id === Number(req.params.id)
    );

    if (indice === -1) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    productos.splice(indice, 1);

    res.status(200).json({
      mensaje: 'Producto eliminado correctamente'
    });
  });

  return app;
}

module.exports = createApp;
