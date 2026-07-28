import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4173;
const LEADS_FILE = path.join(__dirname, 'leads.json');

app.use(cors());
app.use(express.json());

// Ensure leads.json exists
if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([]));
}

// Servir archivos estáticos desde dist (Vite build)
app.use(express.static(path.join(__dirname, 'dist'), { index: 'index.html' }));

// API para leads
app.post('/api/contacto', (req, res) => {
    const { nombre, telefono, tipoPorton, mensaje } = req.body;

    if (!nombre || !telefono) {
        return res.status(400).json({ error: 'Nombre y teléfono son obligatorios' });
    }

    const newLead = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        nombre,
        telefono,
        tipoPorton: tipoPorton || 'No especificado',
        mensaje: mensaje || ''
    };

    try {
        const leadsData = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
        leadsData.push(newLead);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leadsData, null, 2));

        console.log(`Nuevo lead guardado: ${nombre} - ${telefono}`);
        res.status(201).json({ success: true, message: 'Contacto guardado exitosamente' });
    } catch (error) {
        console.error('Error al guardar el lead:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📂 Sirviendo archivos desde: ${path.join(__dirname, 'dist')}`);
    console.log(`📦 Leads guardados en: ${LEADS_FILE}`);
});
