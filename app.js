require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.urlencoded({extended: true})); //Convertir los datos que se reciben del cliente

app.use(bodyParser.json());


app.use(express.static('views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/autenticar.html')
});

app.post('/autenticar', (req, res) => {
    if (req.body.usuario === 'asd' && req.body.contrasena === '123') {
        const payload = {
            check: true //Marcamos que es correcto el login
        }
        const token = jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: 1440
        });

        const user = {
            name: req.body.usuario
        }

        const accessToken = generarToken(user)
        const refreshToken = jwt.sign(user, process.env.JWT_REFRESH)

        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } else {
        res.json({ mensaje: "Usuario o contraseña incorrecto", })
    }
})

function generarToken(user) {
    return jwt.sign(user, process.env.JWT_KEY, { expiresIn: '15s'})
}

app.get('/datos', (req, res) => {
	const datos = [
		{ id: 1, nombre: "Asfo" },
		{ id: 2, nombre: "Denisse" },
		{ id: 3, nombre: "Carlos" }
	];
	
	res.json(datos);
});

app.listen(3000, () => {
    console.log('Servidor iniciado')
});