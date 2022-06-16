const Category = require('../models/category');
const storage = require('../utils/cloud_storage');

module.exports = {

  async create(req, res, next) {
    console.log('REQ body:', req.body);
    try {
      const category = JSON.parse(req.body.category);
      console.log('Category', category);

      const files = req.files;

      if (files.length > 0) { // Se recive un archivo desde la peticion
        const pathImage = `image_${Date.now()}`; // Nombre del archivo
        const url = await storage(files[0], pathImage);

        if (url != undefined && url != null) {
          category.image = url;
        }
      }

      const data = await Category.create(category);

      return res.status(200).json({
        success: true,
        message: 'Se ha creado la categoria correctamente',
        data: {
          'id': data.id
        }
      })
    } catch (err) {
      console.error('Error', err);
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al crear la categoria',
        error: err
      });
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await Category.getAll();

      return res.status(201).json(data);
    } catch (err) {
      console.error('Error', err);
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al crear la categoria',
        error: err
      });
    }
  }
}
