const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoUrl = 'https://codeload.github.com/logith2006/NETCAST-AI/zip/refs/heads/main';
const zipPath = path.join(__dirname, 'repo.zip');
const extractDir = path.join(__dirname, 'extracted_repo');
const currentSrcDir = path.join(__dirname, 'netcast-ai', 'src');

console.log('Downloading old repository...');

const file = fs.createWriteStream(zipPath);
https.get(repoUrl, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download complete. Extracting...');
    
    try {
      // Using tar to extract zip (available in Windows 10+)
      execSync(`tar -xf repo.zip`, { stdio: 'inherit' });
      
      console.log('Extraction complete. Copying src folder to replace current project...');
      const oldSrcDir = path.join(__dirname, 'NETCAST-AI-main', 'netcast-ai', 'src');
      
      // Copy files using xcopy (cmd)
      execSync(`xcopy /E /I /Y "${oldSrcDir}" "${currentSrcDir}"`, { stdio: 'inherit' });
      
      console.log('Successfully restored old design! You can now start the frontend.');
    } catch (e) {
      console.error('Error during extraction/copying:', e);
    }
  });
}).on('error', (err) => {
  console.error('Error downloading:', err);
});
