import express from 'express';
import { env } from './config/env.js';
import { corsMiddleware, loggerMiddleware, errorMiddleware } from './middlewares/index.js';
import apiRoutes from './routes/index.js';

// ─── App Setup ─────────────────────────────────────────────────

const app = express();

// ─── Global Middlewares ────────────────────────────────────────

app.use(corsMiddleware);
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ────────────────────────────────────────────────

app.use('/api', apiRoutes);

// ─── 404 Handler ───────────────────────────────────────────────

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: { message: 'Route not found' },
    });
});

// ─── Error Handler (must be last) ──────────────────────────────

app.use(errorMiddleware);

// ─── Start Server ──────────────────────────────────────────────

app.listen(env.port, () => {
    console.log('');
    console.log('  ⛏️  Bitcoin Block Explorer API');
    console.log(`  ├─ Environment : ${env.nodeEnv}`);
    console.log(`  ├─ Port        : ${env.port}`);
    console.log(`  ├─ API URL     : http://localhost:${env.port}/api`);
    console.log(`  └─ Blockchain  : ${env.blockchain.apiUrl}`);
    console.log('');
});

export default app;
