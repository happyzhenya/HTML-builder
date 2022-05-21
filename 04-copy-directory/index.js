const fs = require('fs');
const path = require('path');

async function CopyDir() {
  try {
    await fs.promises.mkdir(path.join(__dirname, 'files-copy'), {
      recursive: true,
    });
    console.log('The files-copy directory has been created');
    const filesCopy = await fs.promises.readdir(
      path.join(__dirname, 'files-copy')
    );
    for (let file of filesCopy) {
      await fs.promises.unlink(path.join(__dirname, 'files-copy', file));
    }
    const files = await fs.promises.readdir(path.join(__dirname, 'files'));
    files.forEach((file) => {
      let ws = fs.createWriteStream(path.join(__dirname, 'files-copy', file));
      let rs = fs.createReadStream(path.join(__dirname, 'files', file));
      rs.pipe(ws);
    });
  } catch (error) {
    console.log(error);
  }
}

CopyDir();
