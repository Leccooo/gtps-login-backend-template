const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimiter = require('express-rate-limit');
const compression = require('compression');
const path = require('path');

// Middleware kompresi
app.use(compression({
    level: 5,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// EJS dan pengaturan dasar
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/html'));
app.set('trust proxy', 1);

// Middleware header + logger
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} - ${res.statusCode}`);
    next();
});

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Rate limiter
app.use(rateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 800,
    headers: true
}));

// Favicon handler
app.all('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Register endpoint
app.all('/player/register', (req, res) => {
    res.send("Coming soon...");
});

// Login dashboard (optional rendering)
app.all('/player/login/dashboard', (req, res) => {
    const tData = {};
    try {
        const uData = JSON.stringify(req.body).split('"')[1].split('\\n');
        const uName = uData[0].split('|');
        const uPass = uData[1].split('|');

        for (let i = 0; i < uData.length - 1; i++) {
            const d = uData[i].split('|');
            tData[d[0]] = d[1];
        }

        if (uName[1] && uPass[1]) {
            res.redirect('/player/growid/login/validate');
            return;
        }
    } catch (err) {
        console.log(`Warning: ${err}`);
    }

    res.render('dashboard.ejs', { data: tData });
});

// GrowID login validator
app.all('/player/growid/login/validate', (req, res) => {
    const _token = req.body._token;
    const growId = req.body.growId;
    const password = req.body.password;

    if (!growId || !password) {
        return res.status(400).json({ status: "error", message: "Missing credentials" });
    }

    const token = Buffer.from(
        `_token=${_token}&growId=${growId}&password=${password}`
    ).toString('base64');

    res.json({
        status: "success",
        message: "Account Validated.",
        token: token,
        url: "",
        accountType: "growtopia",
        accountAge: 2
    });
});

// Token checker
app.all('/player/growid/checktoken', (req, res) => {
    const { refreshToken } = req.body;

    try {
        const decoded = Buffer.from(refreshToken, 'base64').toString('utf-8');

        if (typeof decoded !== 'string' || !decoded.includes('growId=')) {
            return res.render('dashboard.ejs');
        }

        res.json({
            status: 'success',
            message: 'Account Validated.',
            token: refreshToken,
            url: '',
            accountType: 'growtopia',
            accountAge: 2
        });
    } catch (error) {
        console.log("Redirecting to dashboard due to invalid token");
        res.render('dashboard.ejs');
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Nature Backend By @Lecco');
});

// Listen
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Listening on port ${PORT}`);
});
