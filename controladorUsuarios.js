/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador de registro          
 *: Archivo       : contorladorUsuarios.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *:                 
 *: Fecha         : 15/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Se realizará el contorlador de la seccion de registros
 *: Ult.Modif.    : 15/10/2024
 *: Fecha: 15/10/2024 
 *: Modificó: Rodrigo Macias Ruiz 
 *: Modificación: Creación de controlador para los usuarios
 *:======================================================================================================
 *: 
 *: 15/10/2024: 
 *: Nombre : Rodrigo Macias Ruiz.
 *: Se realizó el controlador para poder gestionar a los usuarios en base de datos
 *: 17/10/2024: 
 *: Nombre : Rodrigo Macias Ruiz.
 *: Se actulizó el contorlador para poder gestionar el inicio de sesión y también se actualizó el metodo
 *: para registrar el usuario (haseo de contraseñas), por temas de seguridad
 *:------------------------------------------------------------------------------------------------------
 */

const db = require('../db');
/*
Metodo para registrar al ususario modificado con haseo
Última modificiación: 17/10/2024
*/

exports.registerUser = (req, res) => {
    const { nombre, correo, contraseña } = req.body;
    bcrypt.hash(contraseña, 10, (err, hash) => {
        if (err) {
            console.error('Error al hashear la contraseña:', err);
            res.status(500).send('Error al registrar el usuario');
        } else {
            const query = 'INSERT INTO Usuarios (nombre, correo, contraseña, fecha_creacion) VALUES (?, ?, ?, CURDATE())';
            db.query(query, [nombre, correo, hash], (err, results) => {
                if (err) {
                    console.error('Error al registrar el usuario:', err);
                    res.status(500).send('Error al registrar el usuario');
                } else {
                    res.status(201).send('Usuario registrado exitosamente');
                }
            });
        }
    });
};
/* 
Metodo para iniciar sesión
Última modificación: 17/10/2024
*/
exports.loginUser = (req, res) => {
const { correo, contraseña } = req.body;
const query = 'SELECT * FROM Usuarios WHERE correo = ?';
db.query(query, [correo], (err, results) => {
    if (err) {
        console.error('Error al buscar el usuario:', err);
        res.status(500).send('Error del servidor');
    } else if (results.length === 0) {
        res.status(401).send('Correo o contraseña incorrectos');
    } else {
        const user = results[0];
        bcrypt.compare(contraseña, user.contraseña, (err, isMatch) => {
            if (err) {
                console.error('Error al comparar contraseñas:', err);
                res.status(500).send('Error del servidor');
            } else if (!isMatch) {
                res.status(401).send('Correo o contraseña incorrectos');
            } else {
                res.status(200).send('Inicio de sesión exitoso');
            }
        });
    }
});
};