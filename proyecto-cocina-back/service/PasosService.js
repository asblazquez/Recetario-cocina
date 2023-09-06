
const getPasosFromRecetaById = (connection, id) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT p.id, p.descripcion
        FROM [RECETARIO].[dbo].[Paso] AS p
        where p.receta_id = ${id}
        Order By p.orden asc`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result);
            }
        });
    })
}

const insertPaso = (connection, descripcion, recetaId, orden) => {
    return new Promise((resolve, reject) => {
        const insertQuery = `INSERT INTO [RECETARIO].[dbo].[Paso] (descripcion, receta_id, orden)
        VALUES (?, ?, ?);`;
        connection.query(insertQuery, [descripcion, recetaId, orden]);

        resolve('El Paso ha sido insertado correctamente')
    })
}

module.exports = {
    getPasosFromRecetaById,
    insertPaso
}