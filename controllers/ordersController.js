const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const timeRelative = require('../utils/time_relative');

module.exports = {
    async create(req, res, next) {
        try {
            const order = req.body;
            const data = await Order.create(order);

            for (const product of order.products) {
                await OrderHasProducts.create(data.id, product.id, product.quantity);
            }

            return res.status(200).json({
                success: true,
                message: 'Se creo correctamente la orden',
                data: {
                    'id': data.id
                }
            })

        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    },

    async findByStatus(req, res, next) {
        try {
            const status = req.params.status;
            let data = await Order.findByStatus(status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })
            return res.status(200).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al tratar de obtener por estado',
                error: error
            });
        }
    },


    async findByClientAndStatus(req, res, next) {
        try {
            const status = req.params.status;
            const id_client = req.params.id_client;

            let data = await Order.findByClientAndStatus(id_client, status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })
            return res.status(200).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al tratar de obtener por estado',
                error: error
            });
        }
    }
}