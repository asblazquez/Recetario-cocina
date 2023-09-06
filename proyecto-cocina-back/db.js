const odbc = require('odbc');

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

module.exports = {
    getConnection,
    closeConnection
}