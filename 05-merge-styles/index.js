const fs = require('fs');
const fspromises = require('fs/promises');
const path = require('path');
const dir = path.join(__dirname, 'styles');
const array = [];

fs.readdir(path.join(dir), { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  console.log(files);
  for (let file of files) {
    if (file.isFile && file.name.split('.')[1] === 'css') {
      console.log(file.name);
      readFile(file.name);
 
    } else {
      console.log(file.name + ' is not a file .css');
    }
  }
});

async function readFile(name) {
  try {
    const data = await fspromises.readFile(path.join(dir, name));
    array.join(' ');
    array.push(data + '\n');

    //  console.log(array.toString())
    fs.writeFile(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      array.join(' ').toString(),
      function (error) {
        if (error) throw error;
        console.log('Данные успешно записаны записать файл');
      }
    );
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}
