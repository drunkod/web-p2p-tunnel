const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// API routes for testing
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API endpoint works!',
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    headers: req.headers,
    tunnel: 'web-p2p-tunnel'
  });
});

app.post('/api/echo', (req, res) => {
  res.json({
    message: 'Echo endpoint works!',
    body: req.body,
    timestamp: new Date().toISOString(),
    method: req.method
  });
});

// Root route with interactive test page
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Web P2P Tunnel Test Server</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 40px; 
          background: #f5f5f5; 
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          background: white; 
          padding: 30px; 
          border-radius: 8px; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .status { 
          background: #e8f5e8; 
          padding: 20px; 
          border-radius: 5px; 
          margin: 20px 0; 
        }
        .endpoint { 
          background: #f8f9fa; 
          padding: 15px; 
          margin: 10px 0; 
          border-radius: 5px; 
          border-left: 4px solid #007bff; 
        }
        button { 
          background: #007bff; 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 5px; 
          cursor: pointer; 
          margin: 5px; 
          font-size: 14px;
        }
        button:hover { 
          background: #0056b3; 
        }
        #results { 
          background: #f8f9fa; 
          border: 1px solid #dee2e6; 
          border-radius: 5px; 
          padding: 15px; 
          margin-top: 20px; 
          min-height: 100px; 
        }
        pre { 
          background: #282c34; 
          color: #abb2bf; 
          padding: 15px; 
          border-radius: 5px; 
          overflow-x: auto; 
        }
        .tunnel-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Web P2P Tunnel Test Server</h1>
        
        <div class="status">
          <h2>✅ Server is running successfully!</h2>
          <p><strong>Current time:</strong> <span id="current-time"></span></p>
          <p><strong>Server port:</strong> ${PORT}</p>
          <p><strong>Local URL:</strong> http://localhost:${PORT}</p>
        </div>
        
        <div class="tunnel-info">
          <h3>🔗 Tunnel Status</h3>
          <p>If you're accessing this via <strong>tunnel.andrewt.io</strong>, the tunnel is working!</p>
          <p>If you're accessing this via <strong>localhost:${PORT}</strong>, start the tunnel to test it.</p>
        </div>
        
        <h2>📡 Test Endpoints</h2>
        <div class="endpoint">
          <strong>GET /api/test</strong> - Returns JSON with server info and headers
        </div>
        <div class="endpoint">
          <strong>POST /api/echo</strong> - Echoes back the request body with metadata
        </div>
        
        <h2>🧪 Interactive Tests</h2>
        <button onclick="testAPI()">Test GET /api/test</button>
        <button onclick="testEcho()">Test POST /api/echo</button>
        <button onclick="testCurrentTime()">Update Current Time</button>
        <button onclick="clearResults()">Clear Results</button>
        
        <div id="results">
          <p><em>Click a test button above to see results here...</em></p>
        </div>
      </div>
      
      <script>
        // Update time on page load
        document.getElementById('current-time').textContent = new Date().toISOString();
        
        async function testAPI() {
          const results = document.getElementById('results');
          results.innerHTML = '<p>🔄 Testing GET /api/test...</p>';
          
          try {
            const response = await fetch('/api/test');
            const data = await response.json();
            results.innerHTML = 
              '<h3>✅ GET /api/test Result:</h3>' +
              '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
          } catch (error) {
            results.innerHTML = 
              '<h3>❌ Error:</h3>' +
              '<pre>Error: ' + error.message + '</pre>';
          }
        }
        
        async function testEcho() {
          const results = document.getElementById('results');
          results.innerHTML = '<p>🔄 Testing POST /api/echo...</p>';
          
          const testData = {
            test: 'Hello from web-p2p-tunnel!',
            timestamp: new Date().toISOString(),
            random: Math.random()
          };
          
          try {
            const response = await fetch('/api/echo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(testData)
            });
            const data = await response.json();
            results.innerHTML = 
              '<h3>✅ POST /api/echo Result:</h3>' +
              '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
          } catch (error) {
            results.innerHTML = 
              '<h3>❌ Error:</h3>' +
              '<pre>Error: ' + error.message + '</pre>';
          }
        }
        
        function testCurrentTime() {
          document.getElementById('current-time').textContent = new Date().toISOString();
          document.getElementById('results').innerHTML = 
            '<h3>🕒 Time Updated</h3>' +
            '<p>Current time has been updated above.</p>';
        }
        
        function clearResults() {
          document.getElementById('results').innerHTML = 
            '<p><em>Results cleared. Click a test button to run tests...</em></p>';
        }
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log('🚀 Test server running at http://localhost:' + PORT);
  console.log('📝 Available endpoints:');
  console.log('   GET  / - Interactive test page');
  console.log('   GET  /api/test - API test endpoint');
  console.log('   POST /api/echo - Echo test endpoint');
  console.log('');
  console.log('🔗 Next steps:');
  console.log('1. Test locally: curl http://localhost:' + PORT + '/api/test');
  console.log('2. Start tunnel: web-p2p-tunnel -signaling-server-url https://signal.andrewt.io -tunnel-target-url http://localhost:' + PORT);
  console.log('3. Connect via: https://tunnel.andrewt.io/tunnel');
});