import express from 'express';
import axios from 'axios';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import debug from 'debug';
import helmet from 'helmet';
import logger from 'morgan';
import { dirname } from 'path';
import { fileURLToPath, URL } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { start } from './server/server.js';
import indexRoutes from './server/routes/index.js';
import authRoutes from './server/routes/auth.js';
import installRoutes from './server/routes/install.js';

import { appName, port, redirectUri } from './config.js';
import userStatusRoutes from './server/routes/userStatus.js';


// Python backend URL (status & SSE)
const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:5000';
if (!process.env.PYTHON_BACKEND_URL) {
  console.warn(`PYTHON_BACKEND_URL not set; defaulting to ${pythonBackendUrl}`);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const redirectHost = new URL(redirectUri).host;

/* App Config */
const app = express();
const dbg = debug(`${appName}:app`);

// ########## SECURITY HEADERS ##########
app.use(
  helmet({
    frameguard: { action: 'sameorigin' },
    hsts: { maxAge: 31536000, includeSubDomains: true },
    referrerPolicy: { policy: 'same-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", `https://${redirectHost}`, 'https://appssdk.zoom.us'],
        scriptSrc:  ["'self'", 'https://appssdk.zoom.us'],
        styleSrc:   ["'self'", "'unsafe-inline'"],
        imgSrc:     ["'self'", `https://${redirectHost}`],
        connectSrc: ["'self'", `https://${redirectHost}`, 'https://api.zoom.us', pythonBackendUrl],
        frameSrc:   ["'self'", 'https://appssdk.zoom.us'],
        baseUri:    ["'self'"],
        formAction: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false,
  })
);
// #######################################

// JSON status route: proxy to Python backend explicitly
app.get('/api/status', async (req, res, next) => {
  try {
    const { data } = await axios.get(`${pythonBackendUrl}/api/status`);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Proxy SSE /stream → Python backend
app.use(
  '/stream',
  createProxyMiddleware({
    target: pythonBackendUrl,
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
    onProxyReq(proxyReq, req) {
      console.debug(`[proxy] ${req.method} ${req.originalUrl} → ${pythonBackendUrl}${req.originalUrl}`);
    },
  })
);

app.set('view engine', 'pug');
app.set('views', `${__dirname}/server/views`);
app.locals.basedir = `${__dirname}/dist`;

app.set('port', port);
app.set('trust proxy', true);

// Logging middleware
app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev', { stream: { write: (msg) => dbg(msg) } }));

// Serve static front-end bundle
app.use(express.static(`${__dirname}/dist`));

/* Routing */
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/api/user-status', userStatusRoutes);
app.use('/', installRoutes);



// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (res.locals.error) dbg(`Error ${status} %s`, err.stack);
  res.status(status).render('error');
});

// Fallback to home for any other route
app.get('*', (req, res) => res.redirect('/'));

// Launch server
start(app, port).catch((e) => {
  console.error(e);
  process.exit(1);
});

export default app;
