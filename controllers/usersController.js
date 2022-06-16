const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const Keys = require('../config/keys');
const User = require('../models/user');
const Rol = require('../models/rol');
const storage = require('../utils/cloud_storage');

module.exports = {
  async getAll(req, res, next) {
    try {
      const data = await User.getAll();
      console.log(`Usuarios: ${data}`);

      return res.status(200).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: 'Error del servidor'
      });
    }
  },

  async findDeliveryMen(req, res, next) {
    try {
      const data = await User.findDeliveryMen();
      return res.status(200).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: 'Error del servidor'
      });
    }
  },

  async register(req, res, next) {
    try {
      const user = req.body;
      const data = await User.create(user);
      await Rol.create(data.id, 1);

      const token = jwt.sign({
        id: data.id,
        email: user.email
      }, Keys.secretOrKey, {
        // expiresIn:
      })

      const myData = {
        id: data.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        image: user.image,
        session_token: `JWT ${token}`
      };

      return res.status(200).json({
        success: true,
        message: 'El registro se realizo correctamente',
        data: myData
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: 'Error del servidor',
        error: error
      })
    }
  },

  async login(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const myUser = await User.findByEmail(email);

      if (!myUser) return res.status(401).json({
        success: false,
        message: 'Valores incorrectos'
      })

      const isPasswordValid = await bcrypt.compare(password, myUser.password);
      console.log(isPasswordValid)
      if (isPasswordValid) {
        const token = jwt.sign({
          id: myUser.id,
          email: myUser.email
        }, Keys.secretOrKey, {
          // expiresIn:
        })

        const data = {
          id: myUser.id,
          name: myUser.name,
          lastname: myUser.lastname,
          email: myUser.email,
          phone: myUser.phone,
          image: myUser.image,
          session_token: `JWT ${token}`,
          roles: myUser.roles
        };

        await User.updateSessionToken(myUser.id, `JWT ${token}`);

        return res.status(200).json({
          success: true,
          message: 'Inicio sesion el usuario',
          data: data
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Valores incorrectos'
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: 'Error del servidor :(',
        error: error
      })
    }
  },

  async update(req, res, next) {
    try {
      const user = JSON.parse(req.body.user); // Objeto cliente que se recive desde la url
      console.log(user);
      const files = req.files;
      if (files.length > 0) { // Se recive un archivo desde la peticion
        const pathImage = `image_${Date.now()}`; // Nombre del archivo
        const url = await storage(files[0], pathImage);

        if (url != undefined && url != null) {
          user.image = url;
        }
      }

      await User.update(user); // Actualizamos la url en la base de datos

      return res.status(200).json({
        success: true,
        message: 'Los datos del usuario se han actualizado correctamente',
        data: user
      });

    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: 'Error del servidor :(',
        error: error
      });
    }
  },


  async updateWithoutImage(req, res, next) {
    try {
      const user = req.body; // Objeto cliente que se recive desde la url
      console.log(req.body);

      await User.update(user); // Actualizamos la url en la base de datos
      console.log(user);
      return res.status(200).json({
        success: true,
        message: 'Los datos del usuario se han actualizado correctamente',
        data: user
      });

    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: 'Error del servidor :(',
        error: error
      });
    }
  }

};
