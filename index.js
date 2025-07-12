const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimiter = require('express-rate-limit');
const compression = require('compression');
const path = require('path');

// Middleware Kompresi
app.use(compression({
  level: 5,
  threshold: 0,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/html'));
app.set('trust proxy', 1);

// Middleware Logger & Header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Rate Limiter
app.use(rateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 800,
  headers: true
}));

// Favicon
app.all('/favicon.ico', (req, res) => res.status(204).end());

// Halaman Register
app.all('/player/register', (req, res) => {
  res.send("Coming soon...");
});

// Endpoint utama yang menerima login
app.post('/player/growid/login/validate', (req, res) => {
  const { _token, growId, password } = req.body;

  // Validasi input sederhana
  if (!growId || !password) {
    return res.status(400).json({ status: "error", message: "Missing growId or password" });
  }

  // Simulasi token sederhana (bukan untuk produksi)
  const token = Buffer.from(
    `_token=${_token}&growId=${growId}&password=${password}`
  ).toString('base64');

  return res.json({
    status: "success",
    message: "Account Validated.",
    token: token,
    url: "",
    accountType: "growtopia",
    accountAge: 2
  });
});

// Dashboard (optional view, jika login pakai EJS)
app.post('/player/login/dashboard', (req, res) => {
  const data = req.body;

  if (!data.growId || !data.password) {
    return res.redirect('/');
  }

  // Render dashboard.ejs dengan data
  return res.render('dashboard.ejs', { data });
});

// Check token endpoint
app.post('/player/growid/checktoken', (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = Buffer.from(refreshToken, 'base64').toString('utf-8');

    if (!decoded.includes('growId=') || !decoded.includes('password=')) {
      return res.status(400).json({ status: "error", message: "Invalid token" });
    }

    res.json({
      status: "success",
      message: "Token Valid.",
      token: refreshToken,
      url: "",
      accountType: "growtopia",
      accountAge: 2
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: "Failed to decode token" });
  }
});

// Default Route
app.get('/', (req, res) => {
  res.send('✅ Nature Backend By @Lecco is running');
});

// Jalankan Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend listening on port ${PORT}`);
});
