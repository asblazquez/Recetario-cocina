const express = require('express');
const cors = require('cors')
const odbc = require('odbc');

const app = express();
const PORT = 5000;

app.use(cors());

const connectionString = 'DSN=RECETARIO;UID=;PWD=;';

// Función para obtener una conexión
const getConnection = (connection) => {
    return new Promise((resolve, reject) => {
        odbc.connect(connectionString, (err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
};


const closeConnection = (connection) => {
    return new Promise((resolve, reject) => {
        if (connection) {
            connection.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
};

/* Metodo que comprueba si el nombre de usuario ya existe */
app.get('/checkUserExist', async (req, res) => {
    try {
        const connection = await getConnection();
        const { username } = req.query
        const sqlQuery = `Select * 
        From [RECETARIO].[dbo].[Usuario] 
        where usuario_id = '${username}'`;

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Error executing query' })
            } else {
                res.json(result[0] !== undefined ? true : false);
            }

            closeConnection(connection)
                .catch((err) => {
                    console.error('Error closing connection:', err);
                });
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo que comprueba si el nombre de la receta ya existe */
app.get('/checkNombreRecetaExist', async (req, res) => {
    try {
        const connection = await getConnection();
        const { name } = req.query
        const sqlQuery = `Select * 
        From [RECETARIO].[dbo].[Receta] 
        where nombre = '${name}'`;

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Error executing query' })
            } else {
                res.json(result[0] !== undefined ? true : false);
            }

            closeConnection(connection)
                .catch((err) => {
                    console.error('Error closing connection:', err);
                });
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo que comprueba si el nombre de la receta ya existe */
app.get('/checkNombreIngredienteExist', async (req, res) => {
    try {
        const connection = await getConnection();
        const { name } = req.query
        const sqlQuery = `Select * 
        From [RECETARIO].[dbo].[Ingrediente] 
        where nombre = '${name}'`;

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Error executing query' })
            } else {
                res.json(result[0] !== undefined ? true : false);
            }

            closeConnection(connection)
                .catch((err) => {
                    console.error('Error closing connection:', err);
                });
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo que obtiene todas las recetas */
app.get('/getAllRecetas', async (req, res) => {
    try {
        const connection = await getConnection();
        const sqlQuery = `SELECT 
        r.id, r.nombre, r.descripcion, r.tiempo, r.descripcion, tr.nombre AS tipo, r.dificultad, r.imagen
        FROM [RECETARIO].[dbo].[Receta] AS r
        JOIN [RECETARIO].[dbo].[Tipo_Receta] AS tr ON r.tipo_id = tr.id`;

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Error executing query' })
            } else {
                res.json(result);
            }

            closeConnection(connection)
                .catch((err) => {
                    console.error('Error closing connection:', err);
                });
        });
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
        const sqlQuery = `Select
        r.id As idReceta, r.descripcion As descripcion, r.nombre As nombreReceta,
        r.tiempo As tiempo, tr.nombre As tipoReceta, u.id As idUduario,
        u.usuario_id As userId, r.imagen
        FROM [RECETARIO].[dbo].[Receta] AS r
        JOIN [RECETARIO].[dbo].[Tipo_Receta] AS tr ON r.tipo_id = tr.id
        JOIN [RECETARIO].[dbo].[Usuario] AS u ON r.user_id = u.id
        Where r.id = ${recetaId}`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Error executing query' })
            } else {
                res.json(result[0]);
            }

            closeConnection(connection)
                .catch((err) => {
                    console.error('Error closing connection:', err);
                });
        });
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
        const sqlQuery = `Select *
        From [RECETARIO].[dbo].[Usuario] 
        where usuario_id = '${username}'`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Error executing query' })
            } else {
                result.some(user => user.usuario_password === password) ? res.json(result[0]) : res.json(null);
            }

            closeConnection(connection)
                .catch((err) => {
                    console.error('Error closing connection:', err);
                });
        });
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
        const sqlQuery = `INSERT INTO [RECETARIO].[dbo].[Usuario] (usuario_id, usuario_password, email, genero)
        VALUES ('${username}', '${password}', '${email}', '${genero}');`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Error executing query' })
            } else {
                res.json('Usuario insertado en la base de datos')
            }

            closeConnection(connection)
                .catch((err) => {
                    console.error('Error closing connection:', err);
                });
        });
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
        const sqlQuery = `SELECT
        i.id As id, i.nombre As nombre, i.descripcion as descripcion,
        ti.nombre as tipo, ir.cantidad as cantidad, i.tipo_id
        FROM [RECETARIO].[dbo].[Ingrediente_Receta] AS ir
        JOIN [RECETARIO].[dbo].[Ingrediente] AS i ON ir.ingrediente_id = i.id
        JOIN [RECETARIO].[dbo].[Tipo_Ingrediente] AS ti ON i.tipo_id = ti.id
        where ir.receta_id = ${id}`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Error executing query' })
            } else {
                res.json(result);
            }

            closeConnection(connection)
                .catch((err) => {
                    console.error('Error closing connection:', err);
                });
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
});

/* Metodo que obtiene todos los pasos de una receta con sus cantidades */
app.get('/getPasosFromRecetaById', async (req, res) => {
    try {
        const connection = await getConnection();
        const { id } = req.query
        const sqlQuery = `SELECT p.id, p.descripcion
        FROM [RECETARIO].[dbo].[Paso] AS p
        where p.receta_id = ${id}
        Order By p.orden asc`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Error executing query' })
            } else {
                res.json(result);
            }

            closeConnection(connection)
                .catch((err) => {
                    console.error('Error closing connection:', err);
                });
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
});

/* Metodo que obtiene una receta by nombre */
app.get('/getRecetaByNombre', async (req, res) => {
    try {
        const connection = await getConnection();
        const { name } = req.query
        const sqlQuery = `SELECT id
        FROM [RECETARIO].[dbo].[Receta]
        where nombre = '${name}'`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Error executing query' })
            } else {
                res.json(result[0].id);
            }

            closeConnection(connection)
                .catch((err) => {
                    console.error('Error closing connection:', err);
                });
        });
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
        const sqlQuery = `SELECT id
        FROM [RECETARIO].[dbo].[Ingrediente]
        where nombre = '${name}'`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Error executing query' })
            } else {
                res.json(result[0].id);
            }

            closeConnection(connection)
                .catch((err) => {
                    console.error('Error closing connection:', err);
                });
        });
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

        const insertQuery = `INSERT INTO [RECETARIO].[dbo].[Receta] (nombre, descripcion, tiempo, tipo_id, user_id, dificultad, imagen)
        VALUES (?, ?, ?, ?, ?, ?, ?);`;
        const result = await connection.query(insertQuery, [nombre, descripcion, tiempo, tipoId, userId, dificultad, imagen]);

        res.status(201).json({ message: 'Receta creada con éxito.' });
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo que inserta un Ingrediente */
app.post('/insertIngrediente', async (req, res) => {
    try {
        const connection = await getConnection();
        const { nombre, descripcion, tipoId, } = req.query

        const insertQuery = `INSERT INTO [RECETARIO].[dbo].[Ingrediente] (nombre, descripcion, tipo_id)
        VALUES (?, ?, ?);`;
        const result = await connection.query(insertQuery, [nombre, descripcion, tipoId]);

        res.status(201).json({ message: 'Ingrediente creado con éxito.' });
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo que inserta un usuario que recibe por parametros */
app.post('/insertIngredienteReceta', async (req, res) => {
    try {
        const connection = await getConnection();
        const { recetaId, ingredienteId, cantidad, } = req.query

        const insertQuery = `INSERT INTO [RECETARIO].[dbo].[Ingrediente_Receta] (receta_id, ingrediente_id, cantidad)
        VALUES (?, ?, ?);`;
        const result = await connection.query(insertQuery, [recetaId, ingredienteId, cantidad]);

        res.status(201).json({ message: 'Ingrediente_Receta creado con éxito.' });
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

/* Metodo que inserta un Paso */
app.post('/insertPaso', async (req, res) => {
    try {
        const connection = await getConnection();
        const { descripcion, recetaId, orden } = req.query

        const insertQuery = `INSERT INTO [RECETARIO].[dbo].[Paso] (descripcion, receta_id, orden)
        VALUES (?, ?, ?);`;
        const result = await connection.query(insertQuery, [descripcion, recetaId, orden]);

        res.status(201).json({ message: 'Paso creado con éxito.' });
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Error connecting to database' });
    }
})

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});