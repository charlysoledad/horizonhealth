/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo de para manipular la base de datos con el CRUD           
 *: Archivo       : app.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *:                 
 *: Fecha         : 09/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Se realizará un CRUD, para realizar el back-end del SPA
 *: Ult.Modif.    : 09/10/2024
 *: Fecha: 09/10/2024 
 *: Modificó: Rodrigo Macias Ruiz
 *: Modificación: Se realizará un CRUD para manipular el back-end
 *:======================================================================================================
 *: Modificación 1
 *: 09/10/2024: 
 *: Nombre : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Se realizó una prueba de conexión de la base de datos
 *: Modificación 2
 *: 15/10/2024: 
 *: Nombre : Rodrigo Macias Ruiz.
 *: Se importo el controlador de usuarios para poder usarlo en la aplicación
 *: 17/10/2024: 
 *: Nombre : Rodrigo Macias Ruiz.
 *: Se agrego la ruta para el método de inicio de sesión
 *:------------------------------------------------------------------------------------------------------
 */

 const express = require ( 'express' );
 const app = express ();
 const db = require ( './db' );
 const controladorUsuarios = require('./controladorUsuarios');
 app.use(express.json());

// Ruta para registrar usuario
app.post('/register', usuariosController.registerUser);
// Ruta para iniciar sesión
app.post('/login', usuariosController.loginUser);

app.listen(3100, () => {
    console.log('Servidor escuchando en el puerto 3100');
});
 