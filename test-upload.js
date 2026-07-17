const fs = require('fs');
const http = require('http');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const payload = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.pdf"\r\nContent-Type: application/pdf\r\n\r\nFake PDF content\r\n--${boundary}--\r\n`;

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/transcript/upload',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});

req.on('error', e => console.error(e));
req.write(payload);
req.end();
