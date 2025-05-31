const express = require('express')
const bodyParser = require('body-parser')
const monedas = require('./monedas') // para utilizar el modelo monedas de la bd
const { Op } = require('sequelize') // para utilizar operadores de sequelize
const cors = require('cors')

const app = express()
const puerto = 3000

app.use(cors())
app.use(bodyParser.json())

app.listen(puerto, () => {
    console.log('servicio iniciado')
})

app.post('/convertir', async (req, res) => {
    const { origen, destino, cantidad } = req.body;
    let resultado = 0;
    
    // obtener de la base de datos la moneda a convertir
    const data = await monedas.findOne({
        where: {
            [Op.and]: [{ origen }, { destino }],
        }
    });

    if (!data) {
        res.sendStatus(404);
    }

    const { valor } = data;
    resultado = cantidad * valor;

    res.send({
        origen,
        destino,
        cantidad,
        resultado
    })

})

// Obtener todas las monedas
app.get('/monedas', async (req, res) => {
    const data = await monedas.findAll();
    if (!data || data.length === 0) return res.sendStatus(404);
    res.send(data);
});

// Crear una nueva moneda
app.post('/crear', async (req, res) => {
    const { origen, destino, valor } = req.body;
    const nuevaMoneda = await monedas.create({ origen, destino, valor });
    res.send(nuevaMoneda);
});

// Actualizar una moneda por ID
app.put('/actualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { origen, destino, valor } = req.body;
    const [actualizados] = await monedas.update(
        { origen, destino, valor },
        { where: { id } }
    );
    if (!actualizados) return res.sendStatus(404);
    res.send({ id, origen, destino, valor });
});

// Eliminar una moneda por ID
app.delete('/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    const eliminados = await monedas.destroy({ where: { id } });
    if (!eliminados) return res.sendStatus(404);
    res.send({ mensaje: `Moneda con ID ${id} eliminada` });
});