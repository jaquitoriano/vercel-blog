const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

const downloadFile = async (url, dest) => {
  const file = fs.createWriteStream(dest);
  await new Promise((resolve, reject) => {
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function setupTinyMCE() {
  const publicDir = path.join(process.cwd(), 'public');
  const tinymceDir = path.join(publicDir, 'tinymce');

  // Create tinymce directory if it doesn't exist
  if (!fs.existsSync(tinymceDir)) {
    fs.mkdirSync(tinymceDir, { recursive: true });
  }

  // Download TinyMCE from CDN
  console.log('Downloading TinyMCE...');
  await downloadFile(
    'https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js',
    path.join(tinymceDir, 'tinymce.min.js')
  );
  console.log('TinyMCE downloaded successfully!');
}

setupTinyMCE().catch(console.error);