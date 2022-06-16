const UserController = require('../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {
    // Obtener datos
    app.get('/api/users/getAll', UserController.getAll);
    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', {session: false}), UserController.findDeliveryMen);

    // Guardar datos
    app.post('/api/users/create', UserController.register);
    app.post('/api/users/login', UserController.login);

    // Actualizar datos
    app.put('/api/users/update', passport.authenticate('jwt', {session: false}), upload.array('image', 1), UserController.update);
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', {session: false}), upload.array('image', 1), UserController.updateWithoutImage);
}
