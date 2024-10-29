/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador de usuarios         
 *: Archivo       : controladorUsuarios.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 15/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar los registros y estado de premium de los usuarios
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Inclusión de lógica para usuarios premium
 *:======================================================================================================
 */

 const express = require('express');
 const router = express.Router();
 const db = require('./db');  // Conexión a la base de datos
 
 // Registro de un nuevo usuario
 router.post('/registro', async (req, res) => {
     const { nombre, correo, contrasena, premium = false } = req.body;
 
     try {
         const result = await db.query(
             'INSERT INTO usuario (nombre, correo, contrasena, premium, fecha_de_creacion) VALUES (?, ?, ?, ?, CURRENT_DATE)',
             [nombre, correo, contrasena, premium]
         );
         res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al registrar usuario' });
     }
 });
 
 // Actualizar usuario a premium
 router.put('/upgrade/:userId', async (req, res) => {
     const { userId } = req.params;
 
     try {
         const [user] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0) {
             await db.query('UPDATE usuario SET premium = TRUE WHERE id_usuario = ?', [userId]);
             res.json({ message: 'Usuario actualizado a premium exitosamente' });
         } else {
             res.status(404).json({ error: 'Usuario no encontrado' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al actualizar a premium' });
     }
 });
 
 // Verificar si un usuario es premium
 router.get('/premium-status/:userId', async (req, res) => {
     const { userId } = req.params;
 
     try {
         const [user] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0) {
             res.json({ userId, premium: user[0].premium });
         } else {
             res.status(404).json({ error: 'Usuario no encontrado' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al verificar el estado premium' });
     }
 });
 
 // Obtener todos los usuarios (opcional)
 router.get('/usuarios', async (req, res) => {
     try {
         const [rows] = await db.query('SELECT id_usuario, nombre, correo, premium FROM usuario');
         res.json(rows);
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al obtener los usuarios' });
     }
 });
 
 module.exports = router;
 