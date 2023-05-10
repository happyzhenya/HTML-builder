const path = require("path");
const fs = require("fs/promises");

const destFolderPath = path.join(__dirname, "project-dist");

init().catch((err) => console.log(err));

//
// Init
async function init() {
  const assetsSourcePath = path.join(__dirname, "assets");
  const assetsDestPath = path.join(destFolderPath, "assets");

  // Remove all
  await fs.rm(destFolderPath, { recursive: true, force: true });

  createFolder();
  createHTML();
  createCSS();
  copyAssets(assetsSourcePath, assetsDestPath);
}

//
// Create html
async function createHTML() {
  const componentsSourcePath = path.join(__dirname, "components");
  const templatePath = path.join(__dirname, "template.html");
  const htmlFile = path.join(destFolderPath, "index.html");

  const files = await fs.readdir(componentsSourcePath, { withFileTypes: true });
  const template = await fs.readFile(templatePath, "utf-8");

  let html = template;

  for (const file of files) {
    const ext = path.extname(file.name).slice(1);

    if (file.isFile() && ext === "html") {
      const filePath = path.join(componentsSourcePath, file.name);

      const component = await fs.readFile(filePath, "utf-8");
      const tag = `{{${file.name.split(".")[0]}}}`;

      html = html.replace(tag, component);
    }
  }

  await fs.writeFile(htmlFile, html);
  console.log("ℹ️ index.html file was created");
}

//
// Create css
async function createCSS() {
  const stylesSourcePath = path.join(__dirname, "styles");
  const stylesDestPath = path.join(destFolderPath, "style.css");

  let css = "";

  const files = await fs.readdir(stylesSourcePath, { withFileTypes: true });

  for (const file of files) {
    const ext = path.extname(file.name).slice(1);

    if (file.isFile() && ext === "css") {
      const filePath = path.join(stylesSourcePath, file.name);

      const data = await fs.readFile(filePath, "utf-8");
      css += data + "\n";
    }
  }

  await fs.writeFile(stylesDestPath, css);
  console.log("ℹ️ style.css file was created");
}

//
// Copy assets
async function copyAssets(source, dest) {
  await fs.mkdir(dest, { recursive: true });

  const files = await fs.readdir(source, { withFileTypes: true });

  for (const file of files) {
    const sourcePath = path.join(source, file.name);
    const destPath = path.join(dest, file.name);

    if (file.isFile()) {
      await fs.copyFile(sourcePath, destPath);
    } else {
      await copyAssets(sourcePath, destPath);
    }
  }
}

//
// Create project folder
async function createFolder() {
  await fs.mkdir(destFolderPath, { recursive: true });
  console.log("ℹ️ project-dist folder was created");
}
