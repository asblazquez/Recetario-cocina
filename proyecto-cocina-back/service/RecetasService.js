
const checkNombreRecetaExist = (connection, name) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `Select * 
        From [RECETARIO].[dbo].[Receta] 
        where nombre = '${name}'`;

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0] !== undefined ? true : false);
            }
        });
    })
}

const getAllRecetas = (connection) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT 
        r.id, r.nombre, r.descripcion, r.tiempo, r.descripcion, tr.nombre AS tipo, r.dificultad, r.imagen
        FROM [RECETARIO].[dbo].[Receta] AS r
        JOIN [RECETARIO].[dbo].[Tipo_Receta] AS tr ON r.tipo_id = tr.id`;

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result);
            }
        });
    })
}

const getRecetaById = (connection, recetaId) => {
    return new Promise((resolve, reject) => {
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
                reject(err)
            } else {
                resolve(result[0]);
            }
        });
    })
}

const getRecetaByNombre = (connection, name) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT id
        FROM [RECETARIO].[dbo].[Receta]
        where nombre = '${name}'`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0].id);
            }
        });
    })
}

const insertReceta = (connection, nombre, descripcion, tiempo, tipoId, userId, dificultad, imagen) => {
    return new Promise((resolve, reject) => {
        const insertQuery = `INSERT INTO [RECETARIO].[dbo].[Receta] (nombre, descripcion, tiempo, tipo_id, user_id, dificultad, imagen)
        VALUES (?, ?, ?, ?, ?, ?, ?);`;
        connection.query(insertQuery, [nombre, descripcion, tiempo, tipoId, userId, dificultad, imagen]);

        resolve('Receta insertada correctamente')
    })
}

module.exports = {
    checkNombreRecetaExist,
    getAllRecetas,
    getRecetaById,
    getRecetaByNombre,
    insertReceta
}