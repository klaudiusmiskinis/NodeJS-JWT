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


app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/token', (req, res) => {
    console.log(req.body.token)
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = generarToken({ name: user.name })
      res.json({ accessToken: accessToken})  
    })
})

app.post('/autenticar', (req, res) => {
    if (req.body.usuario === 'asd' && req.body.contrasena === '123') {
        const user = {
            name: req.body.usuario
        }

        const accessToken = generarToken(user)
        const refreshToken = jwt.sign(user, process.env.JWT_REFRESH)
        refreshTokens.push(refreshToken)
        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } else {
        res.json({ mensaje: "Usuario o contraseña incorrecto", })
    }
})

app.get('/datos', autenticarAcceso, (req, res) => {
	const datos = [
		{ id: 1, nombre: "asd" },
		{ id: 2, nombre: "Denisse" },
		{ id: 3, nombre: "Carlos" }
	];
    res.json(datos)   
});

app.listen(3000, () => {
    console.log('Servidor iniciado')
});

//FUNCIONES

function generarToken(user) {
    return jwt.sign(user, process.env.JWT_KEY, { expiresIn: '60s'})
}

function autenticarAcceso(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
