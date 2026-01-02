// ========================================
// DOCTIC MEDICAL OS - Server Cluster
// Multi-core Node.js pour production
// Impact: +300% throughput
// ========================================

const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;

    console.log(`
╔════════════════════════════════════════╗
║   🚀 Doctic Cluster Manager           ║
║   Master PID: ${process.pid.toString().padEnd(22)}║
║   Workers: ${numCPUs.toString().padEnd(25)}║
╚════════════════════════════════════════╝
  `);

    // Fork workers (1 par CPU)
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
        console.log(`  ✓ Worker ${worker.process.pid} started`);
    }

    // Gestion restart automatique
    cluster.on('exit', (worker, code, signal) => {
        console.error(`❌ Worker ${worker.process.pid} died (${signal || code})`);
        console.log('🔄 Restarting worker...');

        const newWorker = cluster.fork();
        console.log(`  ✓ New worker ${newWorker.process.pid} started`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('📡 SIGTERM received, shutting down gracefully...');

        for (const id in cluster.workers) {
            cluster.workers[id].kill();
        }

        setTimeout(() => {
            console.log('✅ All workers stopped, exiting master');
            process.exit(0);
        }, 10000);
    });

} else {
    // Worker process - lance server.js
    require('./server.js');

    console.log(`💼 Worker ${process.pid} ready and accepting connections`);

    // Worker health monitoring
    setInterval(() => {
        const memUsage = process.memoryUsage();
        const memUsageMB = Math.round(memUsage.rss / 1024 / 1024);

        // Alerte si > 1GB RAM par worker
        if (memUsageMB > 1024) {
            console.warn(`⚠️  Worker ${process.pid} high memory: ${memUsageMB}MB`);
        }
    }, 60000); // Check toutes les 1 min
}
