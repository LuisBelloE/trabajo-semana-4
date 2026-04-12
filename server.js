// Importaciones
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(cookieParser());

// Configuración
const PORT = 3000;
const SECRET = "secreto_super_seguro";

// Usuarios ficticios
const users = [
  { username: "admin", password: "1234" },
  { username: "user", password: "abcd" }
];

// Ruta LOGIN
app.post('/login', (req, res) => 
  const { username, password } = req.body;

  // Validación de usuario
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Credenciales incorrectas. No autorizado." });
  }

  // Generar token
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });

  // Enviar cookie segura
  res.cookie('token', token, {
    httpOnly: true,
    secure: false // cambiar a true en HTTPS
  });

  res.json({ message: "Login exitoso" });
});

// Middleware de verificación
function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

// Ruta protegida
app.get('/private', verifyToken, (req, res) => {
  res.json({
    message: "Acceso autorizado",
    user: req.user
  });
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Sesión cerrada correctamente" });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
