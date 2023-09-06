const express = require('express');
const cors = require('cors')
const { getConnection, closeConnection } = require('./db')
const userService = require('./service/UserService')
const ingredientesService = require('./service/IngredientesService')
const pasosService = require('./service/PasosService')
const recetasService = require('./service/RecetasService')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

//#region Usuario

/* Metodo que comprueba si el nombre de usuario ya existe */
app.get('/checkUserExist', async (req, res) => {
    try {
        const connection = await getConnection();
        const { username } = req.query
        const result = await userService.checkUserExist(connection, username)
        closeConnection(connection)
        res.status(201).json(result)
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo comprueba si el usuario y la contraseña son correctos */
app.get('/checkLogIn', async (req, res) => {
    try {
        const connection = await getConnection();
        const { username, password } = req.query;
        const result = userService.checkLogIn(connection, username, password)
        res.status(201).json(result)
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo que inserta un usuario que recibe por parametros */
app.post('/insertUser', async (req, res) => {
    try {
        const connection = await getConnection();
        const { username, password, email, genero } = req.query
        const result = await userService.insertUser(connection, username, password, email, genero)
        closeConnection(connection)
        res.status(201).json(result)
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

//#endregion

//#region Ingredientes

/* Metodo que comprueba si el nombre de la receta ya existe */
app.get('/checkNombreIngredienteExist', async (req, res) => {
    try {
        const connection = await getConnection();
        const { name } = req.query
        const result = await ingredientesService.checkNombreIngredienteExist(connection, name)
        closeConnection(connection)
        res.status(201).json(result)
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo que obtiene todos los ingredientes de una receta con sus cantidades */
app.get('/getIngredientesFromRecetaById', async (req, res) => {
    try {
        const connection = await getConnection();
        const { id } = req.query
        const result = await ingredientesService.getIngredientesFromRecetaById(connection, id)
        closeConnection(connection)
        res.status(201).json(result)
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
});

/* Metodo que obtiene un Ingrediente by nombre */
app.get('/getIngredienteByNombre', async (req, res) => {
    try {
        const connection = await getConnection();
        const { name } = req.query
        const result = await ingredientesService.getIngredienteByNombre(connection, name)
        closeConnection(connection)
        res.status(201).json(result)
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
});

/* Metodo que inserta un Ingrediente */
app.post('/insertIngrediente', async (req, res) => {
    try {
        const connection = await getConnection();
        const { nombre, descripcion, tipoId } = req.query
        const result = await ingredientesService.insertIngrediente(connection, nombre, descripcion, tipoId)
        closeConnection(connection)
        res.status(201).json(result);
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo que inserta un usuario que recibe por parametros */
app.post('/insertIngredienteReceta', async (req, res) => {
    try {
        const connection = await getConnection();
        const { recetaId, ingredienteId, cantidad } = req.query
        const result = await ingredientesService.insertIngredienteReceta(connection, recetaId, ingredienteId, cantidad)

        res.status(201).json(result);
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

//#endregion

//#region Pasos

/* Metodo que obtiene todos los pasos de una receta con sus cantidades */
app.get('/getPasosFromRecetaById', async (req, res) => {
    try {
        const connection = await getConnection();
        const { id } = req.query
        const result = await pasosService.getPasosFromRecetaById(connection, id)
        closeConnection(connection)
        res.status(201).json(result)
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
});

/* Metodo que inserta un Paso */
app.post('/insertPaso', async (req, res) => {
    try {
        const connection = await getConnection();
        const { descripcion, recetaId, orden } = req.query
        const result = await pasosService.insertPaso(connection, descripcion, recetaId, orden)
        closeConnection(connection)
        res.status(201).json(result);
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

//#endregion


//#region Recetas

/* Metodo que comprueba si el nombre de la receta ya existe */
app.get('/checkNombreRecetaExist', async (req, res) => {
    try {
        const connection = await getConnection();
        const { name } = req.query
        const result = await recetasService.checkNombreRecetaExist(connection, name)
        closeConnection(connection)
        res.status(201).json(result)
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo que obtiene todas las recetas */
app.get('/getAllRecetas', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await recetasService.getAllRecetas(connection)
        closeConnection(connection)
        res.status(201).json(result)
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
});

/* Metodo que obtiene una receta por Id */
app.get('/getRecetaById', async (req, res) => {
    try {
        const connection = await getConnection();
        const { recetaId } = req.query;
        const result = await recetasService.getRecetaById(connection, recetaId)
        closeConnection(connection)
        res.status(201).json(result)
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo que obtiene una receta by nombre */
app.get('/getRecetaByNombre', async (req, res) => {
    try {
        const connection = await getConnection();
        const { name } = req.query
        const result = await recetasService.getRecetaByNombre(connection, name)
        closeConnection(connection)
        res.status(201).json(result)
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
});

/* Metodo que inserta un usuario que recibe por parametros */
app.post('/insertReceta', async (req, res) => {
    try {
        const connection = await getConnection();
        const { nombre, descripcion, tiempo, tipoId, userId, dificultad, imagen } = req.query
        const result = await recetasService.insertReceta(connection, nombre, descripcion, tiempo, tipoId, userId, dificultad, imagen)

        res.status(201).json(result);
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

//#endregion

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});