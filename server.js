const express = require('express');
const http = require('http');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});

// RUTAS
const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const products = require('./routes/productsRoutes');
const address = require('./routes/addressRoutes');
const orders = require('./routes/ordersRoutes');


const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport)
app.disable('x-powered-by');

app.set('port', port);


// LLAMANDO A LAS RUTAS
users(app, upload);
categories(app, upload);
products(app, upload);
address(app);
orders(app);

server.listen('3000', "192.168.137.183" || 'localhost', function () {
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada...');
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}
