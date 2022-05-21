const fs = require('fs');
const fspromises = require('fs/promises');
const path = require('path');
const dirNew = path.join(__dirname, 'project-dist');
const dirAssets = path.join(__dirname, 'assets');
const dirComponents = path.join(__dirname, 'components');
const array = [];

async function createDir() {
  try {
    await fspromises.mkdir(dirNew, { recursive: true });
    console.log(' Project-dist created');
  } catch (error) {
    console.log(error);
  }
}

async function createHtml() {
  try {
    const rsHtml = fs.createReadStream(
      path.join(__dirname, 'template.html'),
      'utf-8'
    );
    const wsHtml = fs.createWriteStream(
      path.join(dirNew, 'index.html'),
      'utf-8'
    );

    let result = '';

    const elements = await fspromises.readdir(dirComponents, {
      withFileTypes: true,
    });
    elements.forEach((element, index) => {
      const rsElement = fs.createReadStream(
        path.join(dirComponents, element.name),
        'utf-8'
      );
      let s = path.basename(element.name, path.extname(element.name));
      rsHtml.on('data', (chunk) => {
        result = chunk;
        rsElement.on('data', (data) => {
          result = result.replace(`{{${s}}}`, data);
          if (index === elements.length - 1) {
            wsHtml.write(result);
          }
        });
      });
    });
    console.log(' index.html created');
  } catch (error) {
    console.log(error);
  }
}

async function createCss() {
  try {
    fs.readdir(
      path.join(__dirname, 'styles'),
      { withFileTypes: true },
      (err, files) => {
        if (err) throw err;
        // console.log(files);
        for (let file of files) {
          if (file.isFile && file.name.split('.')[1] === 'css') {
            // console.log(file.name);
            readFile(file.name);
          } else {
            console.log(file.name + ' is not a file .css');
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}
async function readFile(name) {
  try {
    const data = await fspromises.readFile(
      path.join(__dirname, 'styles', name)
    );
    array.join(' ');
    array.push(data + '\n');

    //  console.log(array.toString())
    fs.writeFile(
      path.join(dirNew, 'style.css'),
      array.join(' ').toString(),
      function (error) {
        if (error) throw error;
        console.log('data write');
      }
    );
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

async function copyAssets(src, dist) {
  try {
    const items = await fspromises.readdir(src, { withFileTypes: true });

    for (let item of items) {
      if (item.isDirectory()) {
        const newSrc = path.join(src, item.name),
          newDist = path.join(dist, item.name);
        copyAssets(newSrc, newDist);
      } else {
        await fspromises.mkdir(dist, { recursive: true });
        await fspromises.copyFile(
          path.join(src, item.name),
          path.join(dist, item.name)
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

createDir();
createHtml();
createCss();
copyAssets(dirAssets, path.join(dirNew, 'assets'));
