/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador para la sección de lectura       
 *: Archivo       : lecturaController.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 23/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar recursos de las tablas `lectura` y `lecturaPremium`
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Adaptación para acceso diferenciado a contenido premium
 *:======================================================================================================
 */

 const express = require('express');
 const router = express.Router();
 const db = require('./db');  // Conexión a la base de datos
 
 // Obtener lecturas estándar
 router.get('/lecturas', async (req, res) => {
     try {
         const [rows] = await db.query('SELECT * FROM lectura');
         res.json(rows);
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al obtener lecturas' });
     }
 });
 
 // Obtener lecturas premium (solo para usuarios premium)
 router.get('/lecturas/premium', async (req, res) => {
     const { userId } = req.query;
 
     try {
         const [user] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0 && user[0].premium) {
             const [rows] = await db.query('SELECT * FROM lecturaPremium WHERE id_usuario = ?', [userId]);
             res.json(rows);
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al obtener lecturas premium' });
     }
 });
 
 module.exports = router;
 
