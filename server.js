// Custom server entry point for Azure Web Apps
// This file bridges Azure's expectation of server.js with Next.js standalone

const path = require('path');

// Set required environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 3000;
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

// For Next.js standalone, the server is at .next/standalone/server.js
// We need to copy static files and public folder
const fs = require('fs');
const fse = require('fs-extra');

// Copy static files if they exist (for standalone mode)
const standalonePath = path.join(__dirname, '.next', 'standalone');
const staticPath = path.join(__dirname, '.next', 'static');
const publicPath = path.join(__dirname, 'public');

// Check if standalone exists
if (fs.existsSync(standalonePath)) {
  // Copy static folder to standalone
  const standaloneStaticPath = path.join(standalonePath, '.next', 'static');
  if (fs.existsSync(staticPath)) {
    fse.copySync(staticPath, standaloneStaticPath, { overwrite: true });
    console.log('Copied .next/static to standalone');
  }
  
  // Copy public folder to standalone
  const standalonePublicPath = path.join(standalonePath, 'public');
  if (fs.existsSync(publicPath)) {
    fse.copySync(publicPath, standalonePublicPath, { overwrite: true });
    console.log('Copied public to standalone');
  }
  
  // Now require the standalone server
  require(path.join(standalonePath, 'server.js'));
} else {
  // Fallback to regular Next.js server
  const { createServer } = require('http');
  const { parse } = require('url');
  const next = require('next');
  
  const app = next({ dev: false, hostname: process.env.HOSTNAME, port: process.env.PORT });
  const handle = app.getRequestHandler();
  
  app.prepare().then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    })
      .once('error', (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(process.env.PORT, () => {
        console.log(`> Ready on http://${process.env.HOSTNAME}:${process.env.PORT}`);
      });
  });
}
