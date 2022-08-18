module.exports = (io) => {
    const namespace = io.of('/orders/delivery')
    namespace.on('connection', function (socket) {
        console.log('Usuario se conecto a SOCKET IO');

        socket.on('position', function (data) {
            console.log('Se emitio', JSON.parse(data));

            const d = JSON.parse(data); // Debe ser enviado por el cliente (LAT, LNG) double
            namespace.emit(`position/${d.id_order}`, {id_order: d.id_order, lat: d.lat, lng: d.lng}); // Emite en kotlin
        })
        socket.on('disconnect', function (data) {
            console.log('El usuario se desconecto del socket IO');
        })
    })
}