/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador para la sección de ejercicio       
 *: Archivo       : ejercicioController.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 23/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar recursos de las tablas `ejercicio` y `ejercicioPremium`
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Adaptación para acceso diferenciado a contenido premium
 *:======================================================================================================
 */

 const express = require('express');
 const router = express.Router();
 const db = require('./db');  // Conexión a la base de datos
 
 // Obtener ejercicios estándar
 router.get('/ejercicios', async (req, res) => {
     try {
         const [rows] = await db.query('SELECT * FROM ejercicio');
         res.json(rows);
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al obtener ejercicios' });
     }
 });
 
 // Obtener ejercicios premium (solo para usuarios premium)
 router.get('/ejercicios/premium', async (req, res) => {
     const { userId } = req.query;
 
     try {
         const [user] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0 && user[0].premium) {
             const [rows] = await db.query('SELECT * FROM ejercicioPremium WHERE id_usuario = ?', [userId]);
             res.json(rows);
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al obtener ejercicios premium' });
     }
 });
 
 // Agregar ejercicio estándar
 router.post('/ejercicios', async (req, res) => {
     const { rutina, tiempo, completado_ejercicio } = req.body;
 
     try {
         const result = await db.query(
             'INSERT INTO ejercicio (rutina, tiempo, completado_ejercicio) VALUES (?, ?, ?)',
             [rutina, tiempo, completado_ejercicio]
         );
         res.status(201).json({ message: 'Ejercicio agregado exitosamente', ejercicioId: result.insertId });
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al agregar ejercicio' });
     }
 });
 
 // Agregar ejercicio premium (solo para usuarios premium)
 router.post('/ejercicios/premium', async (req, res) => {
     const { userId, rutinaPre, tiempoPre, completado_ejercicioPre } = req.body;
 
     try {
         const [user] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0 && user[0].premium) {
             const result = await db.query(
                 'INSERT INTO ejercicioPremium (id_usuario, rutinaPre, tiempoPre, completado_ejercicioPre) VALUES (?, ?, ?, ?)',
                 [userId, rutinaPre, tiempoPre, completado_ejercicioPre]
             );
             res.status(201).json({ message: 'Ejercicio premium agregado exitosamente', ejercicioPremiumId: result.insertId });
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al agregar ejercicio premium' });
     }
 });
 
 module.exports = router;
 