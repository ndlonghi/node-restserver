const express = require('express');
const _ = require('underscore');

let {verifyAdmin, verifyToken} = require('../middlewares/authentication');

let app = express();

let Categoria = require('../models/categoria');

app.get('/categoria', verifyToken, (req, res) => {
  Categoria.find()
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((error, categoriasDB) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          error
        })
      }
      res.json({
        ok: true,
        categorias: categoriasDB
      })
    })
});

app.get('/categoria/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  Categoria.findById(id, (error, categoriaDB) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error
      });
    }
    if (!categoriaDB) {// Esto en realidad no anda
      return res.status(404).json({
        ok: true,
        error: {
          message: "No existe categoria con ese id."
        }
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    })
  });
});

app.post('/categoria', verifyToken, (req, res) => {
  let body = req.body;
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });
  categoria.save((error, categoriaDB) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error
      })
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        error
      })
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

app.put('/categoria/:id', [verifyToken, verifyAdmin], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['descripcion']);
  Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (error, categoriaDB) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error
      })
    }
    if (!categoriaDB) {
      return res.status(404).json({
        ok: false,
        error: {
          message: "Categoria no encontrada"
        }
      })
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

app.delete('/categoria/:id', [verifyToken, verifyAdmin], (req, res) => {
  let id = req.params.id;
  Categoria.findByIdAndDelete(id, (error, categoriaBorrada) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error
      })
    }
    if (!categoriaBorrada) {
      return res.status(404).json({
        ok: false,
        error: {
          message: 'Categoria no encontrada'
        }
      })
    }
    res.json({
      ok: true,
      categoria: categoriaBorrada
    })
  })
});

module.exports = app;
