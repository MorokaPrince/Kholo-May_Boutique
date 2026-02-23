// Custom server entry point for Azure Web Apps
// This bridges Azure's expectation of server.js with Next.js standalone

const path = require('path');
const fs = require('fs');

// Set required environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 3000;
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

// For Next.js standalone, the server is at .next/standalone/server.js
const standalonePath = path.join(__dirname, '.next', 'standalone');
const standaloneServerPath = path.join(standalonePath, 'server.js');

// Check if standalone exists
if (fs.existsSync(standaloneServerPath)) {
  console.log('Found standalone server at:', standaloneServerPath);
  
  // Copy static files if they exist
  const staticSrc = path.join(__dirname, '.next', 'static');
  const staticDest = path.join(standalonePath, '.next', 'static');
  
  if (fs.existsSync(staticSrc) && !fs.existsSync(staticDest)) {
    console.log('Copying static files...');
    fs.cpSync(staticSrc, staticDest, { recursive: true });
  }
  
  // Copy public folder if it exists
  const publicSrc = path.join(__dirname, 'public');
  const publicDest = path.join(standalonePath, 'public');
  
  if (fs.existsSync(publicSrc) && !fs.existsSync(publicDest)) {
    console.log('Copying public files...');
    fs.cpSync(publicSrc, publicDest, { recursive: true });
  }
  
  // Change to standalone directory and require the server
  process.chdir(standalonePath);
  require('./server.js');
} else {
  console.log('No standalone server found, using regular Next.js...');
  
  // Fallback to regular Next.js server
  const { createServer } = require('http');
  const { parse } = require('url');
  const next = require('next');
  
  const app = next({ dev: false, hostname: process.env.HOSTNAME, port: parseInt(process.env.PORT) });
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
      .listen(parseInt(process.env.PORT), () => {
        console.log(`> Ready on http://${process.env.HOSTNAME}:${process.env.PORT}`);
      });
  });
}
