const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      error: {
        message: 'No file uploaded'
      }
    })
  }

  const tiposValidos = ['productos', 'usuarios'];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      error: {
        message: `Los tipos válidos son: ${tiposValidos.join(', ')}`
      }
    })
  }

  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split('.');
  let extension = nombreCortado[nombreCortado.length - 1];
  const validFileTypes = ['png', 'jpg', 'gif', 'jpeg'];
  if (validFileTypes.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      error: {
        message: 'Las extensiones permitidas son ' + validFileTypes.join(', ')
      }
    })
  }
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (error) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error
      });
    }
    switch (tipo) {
      case 'usuarios': {
        imagenUsuario(id, res, nombreArchivo);
        break;
      }
      case 'productos': {
        imagenProducto(id, res, nombreArchivo);
      }
    }
  })
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (error, usuarioDb) => {
    if (error) {
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        error
      })
    }
    if (!usuarioDb) {
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        error: {
          message: 'El usuario no existe'
        }
      });
    }
    borraArchivo(usuarioDb.img, 'usuarios');
    usuarioDb.img = nombreArchivo;
    usuarioDb.save((error, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado
      });
    })
  })
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (error, productoDb) => {
    if (error) {
      borraArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        error
      })
    }
    if (!productoDb) {
      borraArchivo(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        error: {
          message: 'El producto no existe'
        }
      });
    }
    borraArchivo(productoDb.img, 'productos');
    productoDb.img = nombreArchivo;
    productoDb.save((error, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado
      });
    })
  })
}

function borraArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;
