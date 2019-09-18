const express = require('express');
const _ = require('underscore');

const {verifyToken} = require('../middlewares/authentication');

let app = express();

let Producto = require('../models/producto');

app.get('/productos', verifyToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  Producto.find({disponible: true})
    .skip(desde)
    .limit(5)
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .populate('categoria')
    .exec((error, productosDB) => {
      if (error) {
        res.status(500).json({
          ok: false,
          error
        })
      }
      res.json({
        ok: true,
        productos: productosDB
      })
    })
});

app.get('/productos/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'nombre')
    .exec((error, productoDB) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          error
        });
      }
      if (!productoDB) {// Esto en realidad no anda
        return res.status(404).json({
          ok: true,
          error: {
            message: "No existe producto con ese id."
          }
        });
      }
      res.json({
        ok: true,
        producto: productoDB
      })
    });
});

app.get('/productos/buscar/:termino', verifyToken, (req, res) => {
  let termino = req.params.termino;
  let regex = new RegExp(termino, 'i');
  Producto.find({nombre: regex})
    .populate('usuario', 'nombre email')
    .populate('categoria', 'nombre')
    .exec((error, productosDB) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          error
        })
      }
      res.json({
        ok: true,
        productos: productosDB
      })
    })
});

app.post('/productos', verifyToken, (req, res) => {
  let body = req.body;
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
  });
  producto.save((error, productoDB) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error
      })
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        error: {
          message: "No se pudo crear el producto"
        }
      })
    }
    res.status(201).json({
      ok: true,
      producto: productoDB
    });
  });
});

app.put('/productos/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
  Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (error, productoDB) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error
      })
    }
    if (!productoDB) {
      return res.status(404).json({
        ok: false,
        error: {
          message: "Producto no encontrado"
        }
      })
    }
    res.json({
      ok: true,
      producto: productoDB
    });
  });
});

app.delete('/productos/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  Producto.findByIdAndUpdate(id, {disponible: false}, {new: true, runValidators: true}, (error, productoDB) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error
      })
    }
    if (!productoDB) {
      return res.status(404).json({
        ok: false,
        error: {
          message: "Producto no encontrado"
        }
      })
    }
    res.json({
      ok: true,
      producto: productoDB
    });
  });
});

module.exports = app;
