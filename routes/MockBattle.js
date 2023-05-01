const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'models', 'animals.json');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const animals = JSON.parse(fileContent);

