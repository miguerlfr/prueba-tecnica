import { Router } from 'express';
const router = Router();
import { Proyecto } from '../models/index.js';
import fetch from 'node-fetch';

/**
 * @openapi
 * /proyectos:
 *   get:
 *     summary: Lista proyectos
 *     responses:
 *       200:
 *         description: Lista de proyectos
 */
router.get('/', async (req,res)=>{
  const all = await Proyecto.findAll();
  res.json(all);
});

/**
 * @openapi
 * /proyectos/{id}:
 *   get:
 *     summary: Obtener proyecto por id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Proyecto
 */
router.get('/:id', async (req,res)=>{
  const p = await Proyecto.findByPk(req.params.id);
  if(!p) return res.status(404).json({error:'No encontrado'});
  res.json(p);
});

/**
 * @openapi
 * /proyectos:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Proyecto 1
 *               descripcion:
 *                 type: string
 *                 example: Descripción del proyecto
 *               estado:
 *                 type: string
 *                 enum: [En progreso, Finalizado]
 *                 example: En progreso
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: 2025-10-20
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-20
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *       400:
 *         description: Error al crear proyecto
 */
router.post('/', async (req,res)=>{
  try{
    const newP = await Proyecto.create(req.body);
    res.status(201).json(newP);
  }catch(err){
    res.status(400).json({error: err.message});
  }
});

/**
 * @openapi
 * /proyectos/{id}:
 *   put:
 *     summary: Actualizar un proyecto existente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [En progreso, Finalizado]
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *               fechaFin:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Proyecto actualizado exitosamente
 *       404:
 *         description: Proyecto no encontrado
 */
router.put('/:id', async (req,res)=>{
  const p = await Proyecto.findByPk(req.params.id);
  if(!p) return res.status(404).json({error:'No encontrado'});
  await p.update(req.body);
  res.json(p);
});

/**
 * @openapi
 * /proyectos/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto a eliminar
 *     responses:
 *       200:
 *         description: Proyecto eliminado correctamente
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/:id', async (req,res)=>{
  const p = await Proyecto.findByPk(req.params.id);
  if(!p) return res.status(404).json({error:'No encontrado'});
  await p.destroy();
  res.json({ok:true});
});

// /graficos endpoint
router.get('/graficos/estadisticas', async (req,res)=>{
  const results = await Proyecto.findAll({
    attributes: [
      'estado',
      [Proyecto.sequelize.fn('COUNT', Proyecto.sequelize.col('estado')), 'cantidad']
    ],
    group: ['estado']
  });
  res.json(results);
});


// /analisis endpoint - uses HuggingFace summarization model as an example (requires HF token)
router.post('/analisis', async (req,res)=>{
  try{
    const proyectos = await Proyecto.findAll();
    const textos = proyectos.map(p=>p.descripcion || '').join('\n\n');
    if(!textos.trim()) return res.json({resumen: 'No hay descripciones que resumir.'});

    const HF_TOKEN = process.env.HF_API_KEY;
    if(!HF_TOKEN) return res.json({resumen: 'HF_API_KEY no configurada. Este endpoint necesita llave para IA (ej: HuggingFace).', sampleResumen: textos.slice(0,300) });

    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: { Authorization: `Bearer ${HF_TOKEN}`, 'Content-Type':'application/json' },
      body: JSON.stringify({ inputs: textos })
    });
    const data = await response.json();
    const resumen = Array.isArray(data) ? (data[0].summary_text || JSON.stringify(data)) : (data.error || JSON.stringify(data));
    res.json({resumen});
  }catch(e){
    res.status(500).json({error: e.message});
  }
});

export default router;