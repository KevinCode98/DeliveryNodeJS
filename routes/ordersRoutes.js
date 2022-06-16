const OrdersController = require('../controllers/ordersController');
const passport = require('passport');

module.exports = (app) => {
    // // Obtener datos
    app.get('/api/orders/findByStatus/:status', passport.authenticate('jwt', {session: false}),
        OrdersController.findByStatus);

    app.get('/api/orders/findByClientAndStatus/:id_client/:status', passport.authenticate('jwt', {session: false}),
        OrdersController.findByClientAndStatus);


    // // Guardar datos
    app.post('/api/orders/create', OrdersController.create);

    // Actualizar datos
}
