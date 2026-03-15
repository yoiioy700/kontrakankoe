const fs = require('fs');
const https = require('https');

const TOKEN = 'vca_2MI0eUf0DIVfW8MBKNYiaqDMiSYlQwJ5FmYmKxLtzGjlLYnSHx4YwuyV';
const PROJECT_ID = 'prj_2B1Z7mqaFy9cwc2RDevlV3LPFMu2';
const TEAM_ID = 'team_UQPYADIf94MCs1O3gvE1CLY8';

const envFile = fs.readFileSync('.env', 'utf-8');
const lines = envFile.split(/\r?\n/);

const payloads = [];

for (const line of lines) {
  if (!line.trim() || line.startsWith('#')) continue;
  
  const splitIdx = line.indexOf('=');
  if (splitIdx === -1) continue;
  
  const key = line.slice(0, splitIdx).trim();
  let value = line.slice(splitIdx + 1).trim();
  
  // Strip surrounding quotes
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  } else if (value.startsWith("'") && value.endsWith("'")) {
    value = value.slice(1, -1);
  }
  
  if (key === 'NEXTAUTH_URL') {
    value = 'https://kontrakankoe.vercel.app';
  }
  
  if (key && (value || value === '')) {
    payloads.push({
      key,
      value,
      type: 'encrypted',
      target: ['production', 'preview', 'development']
    });
  }
}

console.log(`Found ${payloads.length} environment variables to upload.`);

// Vercel API /v10/projects/:id/env?upsert=true accepts an array of env vars or single object
// But it's safer to post them one by one if it fails as an array.
async function pushEnv(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = https.request({
      hostname: 'api.vercel.com',
      path: `/v10/projects/${PROJECT_ID}/env?upsert=true&teamId=${TEAM_ID}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`Successfully added ${payload.key}`);
          resolve();
        } else {
          console.error(`Failed to add ${payload.key}: ${res.statusCode} ${body}`);
          resolve(); // Resolve anyway to continue
        }
      });
    });
    
    req.on('error', e => reject(e));
    req.write(data);
    req.end();
  });
}

(async () => {
  for (const p of payloads) {
    await pushEnv(p);
  }
  console.log('All done!');
})();
