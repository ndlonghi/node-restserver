const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);
  Usuario.find({estado: true}, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec((error, usuarios) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error
        })
      }
      Usuario.count({estado: true}, (error, conteo) => {

        res.json({
          ok: true,
          usuarios,
          cuantos: conteo
        })
      });
    })
});

app.post('/usuario', (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((error, usuarioDB) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error
      })
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});

app.put('/usuario/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (error, usuarioDB) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error
      })
    }
    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});

app.delete('/usuario/:id', (req, res) => {
  let id = req.params.id;
  Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (error, usuarioBorrado) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error
      })
    }
    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'Usuario no encontrado'
        }
      })
    }
    res.json({
      ok: true,
      usuario: usuarioBorrado
    })
  })
});

module.exports = app;
