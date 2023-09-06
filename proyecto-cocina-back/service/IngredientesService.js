
const checkNombreIngredienteExist = (connection, name) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `Select * 
        From [RECETARIO].[dbo].[Ingrediente] 
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

const getIngredientesFromRecetaById = (connection, id) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT
        i.id As id, i.nombre As nombre, i.descripcion as descripcion,
        ti.nombre as tipo, ir.cantidad as cantidad, i.tipo_id
        FROM [RECETARIO].[dbo].[Ingrediente_Receta] AS ir
        JOIN [RECETARIO].[dbo].[Ingrediente] AS i ON ir.ingrediente_id = i.id
        JOIN [RECETARIO].[dbo].[Tipo_Ingrediente] AS ti ON i.tipo_id = ti.id
        where ir.receta_id = ${id}`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result);
            }
        });
    })
}

const getIngredienteByNombre = (connection, name) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT id
        FROM [RECETARIO].[dbo].[Ingrediente]
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

const insertIngrediente = (connection, nombre, descripcion, tipoId) => {
    return new Promise((resolve, reject) => {
        const insertQuery = `INSERT INTO [RECETARIO].[dbo].[Ingrediente] (nombre, descripcion, tipo_id)
        VALUES (?, ?, ?);`;
        connection.query(insertQuery, [nombre, descripcion, tipoId]);

        resolve('Ingredeinte añadido correctamente')
    })
}

const insertIngredienteReceta = (connection, recetaId, ingredienteId, cantidad) => {
    return new Promise((resolve, reject) => {
        const insertQuery = `INSERT INTO [RECETARIO].[dbo].[Ingrediente_Receta] (receta_id, ingrediente_id, cantidad)
        VALUES (?, ?, ?);`;
        connection.query(insertQuery, [recetaId, ingredienteId, cantidad]);

        resolve('IngredeintesReceta añadido correctamente')
    })
}

module.exports = {
    checkNombreIngredienteExist,
    getIngredientesFromRecetaById,
    getIngredienteByNombre,
    insertIngrediente,
    insertIngredienteReceta
}