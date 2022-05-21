const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname + '/secret-folder'),
  { withFileTypes: true },
  (error, dirEntryList) => {
    if (!error) {
      dirEntryList.forEach((dirEntry) => {
        if (dirEntry.isFile()) {
          fs.stat(
            path.join(__dirname + '/secret-folder/' + dirEntry.name),
            (error, stats) => {
              if (error) {
                return console.log(error);
              }
              console.log(
                dirEntry.name.split('.')[0] +
                  ' - ' +
                  path
                    .extname(
                      path.join(__dirname + '/secret-folder/' + dirEntry.name)
                    )
                    .split('.')[1] +
                  ' - ' +
                  (stats.size * (1 / 1024)).toFixed(2) +
                  ' kb'
              );
            }
          );
        } else if (dirEntry.isDirectory()) {
          // console.log("it is a directory")
        
        } 
        
        else {
          console.log(error);
        }
      });
    }
  }
);







