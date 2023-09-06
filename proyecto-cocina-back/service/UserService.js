
const checkUserExist = (connection, username) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `Select * 
        From [RECETARIO].[dbo].[Usuario] 
        where usuario_id = '${username}'`;

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0] !== undefined ? true : false)
            }
        });
    })

}

const checkLogIn = (connection, username, password) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `Select *
            From [RECETARIO].[dbo].[Usuario] 
            where usuario_id = '${username}'`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                reject(err)
            } else {
                result.some(user => user.usuario_password === password) ? resolve(result[0]) : resolve(null);
            }
        });
    })
}

const insertUser = (connection, username, password, email, genero) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `INSERT INTO [RECETARIO].[dbo].[Usuario] (usuario_id, usuario_password, email, genero)
        VALUES ('${username}', '${password}', '${email}', '${genero}');`

        connection.query(sqlQuery, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve('Usuario insertado en la base de datos')
            }
        });
    })
}

module.exports = {
    checkUserExist,
    checkLogIn,
    insertUser
}