const https = require('https');

const url = 'https://x5tgcy2nzvmjepcnjih3y57uhe0ghrre.lambda-url.us-east-1.on.aws/';
const data = JSON.stringify({
  prompt: 'Hello! What model are you?'
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(url, options, (res) => {
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
