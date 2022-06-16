const CategoriesController = require('../controllers/categoriesController');
const passport = require('passport');

module.exports = (app, upload) => {
  // Obtener datos
  app.get('/api/categories/getAll', passport.authenticate('jwt', { session: false }), CategoriesController.getAll);

  // Guardar datos
  app.post('/api/categories/create', passport.authenticate('jwt', { session: false }), upload.array('image', 1), CategoriesController.create);

  // Actualizar datos
}
