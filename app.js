/*
 * Entry point for Phusion Passenger (cPanel)
 * This file attempts to load the built application (dist) or the server source.
 */

async function startServer() {
    try {
        // In production on cPanel, we usually run the transpiled server or allow ts-node
        // Option 1: Valid for typical Vite/React apps that act as SPA + API
        // If you have a custom server.js, import it here.

        console.log('Starting Doctic Care via Passenger...');

        // Check if we are running the built server
        const serverPath = './server.js'; // Adjust if your main server file is elsewhere

        await import(serverPath);

    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();
