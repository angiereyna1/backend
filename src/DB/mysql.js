const mysql = require('mysql2');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

let conexion;

function conMysql(){
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) =>{
        if(err){
            console.log('[db err]', err);
            setTimeout(conMysql, 200);
        }else{
            console.log('DB Conectada!!!')
        }
    });

    conexion.on('error', err =>{
        console.log('[db err]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            conMysql();        
        }else{
            throw err;
        }
    })
}

conMysql();

function todos(tabla){
    return new Promise((resolve, reject)=>{
        conexion.query(`SELECT * FROM ${tabla}`, (error, result)=>{
            return error ? reject(error) : resolve(result);
        })
    });
}

function uno(tabla, idRol){
    return new Promise((resolve, reject)=>{
        conexion.query(`SELECT * FROM ${tabla} WHERE idRol = ${idRol}`, (error, result)=>{
            if (error) return reject(error);

            if (result.length > 0) {
                resolve(result[0]);
            } else {
                reject(new Error('No se encontró ningún registro con el ID proporcionado.'));
            }
        });
    });
}


function eliminar(tabla, data){
    return new Promise((resolve, reject)=>{
        conexion.query(`DELETE FROM ${tabla} WHERE idRol = ?`, data.idRol, (error, result)=>{
            if (error) return reject(error);

            if (result.affectedRows > 0) {
                resolve(result);
            } else {
                reject(new Error('No se encontró ningún registro para eliminar.'));
            }
        });
    });
}

module.exports = {
    todos,
    uno,        
    eliminar
}