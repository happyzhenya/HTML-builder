const fs = require('fs');
const path = require('path');

const rs = fs.createReadStream(path.join(__dirname + '/text.txt'), 'utf8');

rs.on('data', function (chunk) {
  console.log(chunk);
});

rs.on('error', function (error) {
  console.log(error);
});
