const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'prueba'
});

db.connect(err => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

app.use(bodyParser.json());

// Ruta para autenticar usuarios
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
  }

  const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = results[0];
    return res.json({ message: 'Inicio de sesión exitoso', user });
  });
});
//Ruta para guardar asistencia 
app.post('/marcaciones', (req, res) => {
    const { userId } = req.body; // Supongamos que el frontend envía el ID del usuario
    if (!userId) {
      return res.status(400).json({ message: 'ID de usuario es requerido' });
    }
  
    const insertQuery = 'INSERT INTO registros_asistencia (usuario_id, fecha, hora) VALUES (?, CURDATE(), CURTIME())';
    db.query(insertQuery, [userId], (err, results) => {
      if (err) {
        console.error('Error al guardar registro de asistencia:', err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      
      return res.json({ message: 'Asistencia marcada exitosamente' });
    });
  });

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});