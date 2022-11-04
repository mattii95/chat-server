const { Pool } = require('pg');

// const dbConnection = async () => {
//     try {
//         console.log('DB ONLINE');

//         return conn;
//     } catch (error) {
//         console.log(error);
//         throw new Error('Error en la base de datos');
//     }
// };

const config = {
    user: 'postgres',
    host: 'localhost',
    password: '123654on',
    database: 'db_chat'
};

const pool = new Pool(config);



module.exports = {
    pool
}