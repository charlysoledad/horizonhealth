/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador para la sección de frases       
 *: Archivo       : frasesController.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 23/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar recursos de las tablas `frases` y `frasesPremium`
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Adaptación para acceso diferenciado a contenido premium
 *:======================================================================================================
 */

 const express = require('express');
 const router = express.Router();
 const db = require('./db');  // Conexión a la base de datos
 
 // Obtener frases estándar según el puntaje más reciente del usuario
 router.get('/frases', async (req, res) => {
     const { userId } = req.query;
 
     try {
         // Obtener el puntaje más reciente del test del usuario
         const [test] = await db.query(
             'SELECT puntaje FROM test WHERE id_usuario = ? ORDER BY fecha_test DESC LIMIT 1',
             [userId]
         );
 
         if (test.length > 0) {
             const puntaje = test[0].puntaje;
 
             // Obtener frases que coincidan con el puntaje
             const [frases] = await db.query(
                 'SELECT frase, autor FROM frases WHERE puntajeFrase = ?',
                 [puntaje]
             );
 
             res.json(frases);
         } else {
             res.status(404).json({ error: 'No se encontró un puntaje reciente para este usuario.' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al obtener las frases.' });
     }
 });
 
 // Obtener frases premium según el puntaje más reciente del usuario (solo para usuarios premium)
 router.get('/frases/premium', async (req, res) => {
     const { userId } = req.query;
 
     try {
         // Verificar si el usuario es premium
         const [user] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0 && user[0].premium) {
             // Obtener el puntaje más reciente del test del usuario
             const [test] = await db.query(
                 'SELECT puntaje FROM test WHERE id_usuario = ? ORDER BY fecha_test DESC LIMIT 1',
                 [userId]
             );
 
             if (test.length > 0) {
                 const puntaje = test[0].puntaje;
 
                 // Obtener frases premium que coincidan con el puntaje
                 const [frasesPremium] = await db.query(
                     'SELECT frasePre AS frase, autorPre AS autor FROM frasesPremium WHERE puntajeFrasePre = ?',
                     [puntaje]
                 );
 
                 res.json(frasesPremium);
             } else {
                 res.status(404).json({ error: 'No se encontró un puntaje reciente para este usuario.' });
             }
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al obtener las frases premium.' });
     }
 });
 
 module.exports = router;
 