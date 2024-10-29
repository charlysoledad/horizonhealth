/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador para la sección de meditación       
 *: Archivo       : meditacionController.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 24/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar recursos de la tabla `meditacion`
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Adaptación para acceso exclusivo a usuarios premium
 *:======================================================================================================
 */

 const express = require('express');
 const router = express.Router();
 const db = require('./db');  // Conexión a la base de datos
 
 // Obtener sesiones de meditación para usuarios premium
 router.get('/meditacion', async (req, res) => {
     const { userId } = req.query;
 
     try {
         const [user] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0 && user[0].premium) {
             const [rows] = await db.query('SELECT * FROM meditacion WHERE id_usuario = ?', [userId]);
             res.json(rows);
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al obtener sesiones de meditación' });
     }
 });
 
 // Agregar nueva sesión de meditación (solo para usuarios premium)
 router.post('/meditacion', async (req, res) => {
     const { userId, tiempo_meditacion, completado_meditacion } = req.body;
 
     try {
         const [user] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0 && user[0].premium) {
             const result = await db.query(
                 'INSERT INTO meditacion (id_usuario, tiempo_meditacion, completado_meditacion) VALUES (?, ?, ?)',
                 [userId, tiempo_meditacion, completado_meditacion]
             );
             res.status(201).json({ message: 'Sesión de meditación agregada exitosamente', meditacionId: result.insertId });
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al agregar sesión de meditación' });
     }
 });
 
 module.exports = router;
 

// Actualizar la duración y el estado de completado de una meditación
exports.updateMeditacionById = (req, res) => {
    const id = req.params.id;
    const { duracion, completado } = req.body;
    const query = 'UPDATE Meditacion SET duracion = ?, completado = ? WHERE id = ?';
    db.query(query, [duracion, completado, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar la meditación:', err);
            res.status(500).send('Error al actualizar la meditación');
        } else if (results.affectedRows === 0) {
            res.status(404).send('Meditación no encontrada');
        } else {
            res.status(200).send('Meditación actualizada exitosamente');
        }
    });
};