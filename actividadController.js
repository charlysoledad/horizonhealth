/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador para la sección de actividad       
 *: Archivo       : actividadController.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 23/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar recursos de las tablas `actividad` y `actividadPremium`
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Adaptación para acceso diferenciado a contenido premium
 *:======================================================================================================
 */

 const express = require('express');
 const router = express.Router();
 const db = require('./db');  // Configuración y conexión a la base de datos
 
 // Obtener actividades estándar
 router.get('/actividades', async (req, res) => {
     try {
         const [rows] = await db.query('SELECT * FROM actividad');
         res.json(rows);
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al obtener actividades' });
     }
 });
 
 // Obtener actividades premium (solo para usuarios premium)
 router.get('/actividades/premium', async (req, res) => {
     const { userId } = req.query;
 
     try {
         // Verificar si el usuario es premium
         const [user] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0 && user[0].premium) {
             // Si el usuario es premium, obtener actividades premium
             const [rows] = await db.query('SELECT * FROM actividadPremium WHERE id_usuario = ?', [userId]);
             res.json(rows);
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al obtener actividades premium' });
     }
 });
 
 // Agregar nueva actividad estándar
 router.post('/actividades', async (req, res) => {
     const { nombre_actividad, descripcion, tiempo_actividad } = req.body;
 
     try {
         const result = await db.query(
             'INSERT INTO actividad (nombre_actividad, descripcion, tiempo_actividad) VALUES (?, ?, ?)',
             [nombre_actividad, descripcion, tiempo_actividad]
         );
         res.status(201).json({ message: 'Actividad agregada exitosamente', actividadId: result.insertId });
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al agregar actividad' });
     }
 });
 
 // Agregar nueva actividad premium (solo para usuarios premium)
 router.post('/actividades/premium', async (req, res) => {
     const { userId, nombre_actividadPre, descripcionPre, tiempo_actividadPre } = req.body;
 
     try {
         // Verificar si el usuario es premium
         const [user] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0 && user[0].premium) {
             // Si el usuario es premium, agregar actividad premium
             const result = await db.query(
                 'INSERT INTO actividadPremium (id_usuario, nombre_actividadPre, descripcionPre, tiempo_actividadPre) VALUES (?, ?, ?, ?)',
                 [userId, nombre_actividadPre, descripcionPre, tiempo_actividadPre]
             );
             res.status(201).json({ message: 'Actividad premium agregada exitosamente', actividadPremiumId: result.insertId });
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al agregar actividad premium' });
     }
 });
 
 module.exports = router;
 