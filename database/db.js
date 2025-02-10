import mysql from 'mysql'

/**
 * @description conexion bd
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const connection = mysql.createConnection({
    //Con variables de entorno
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE
});


