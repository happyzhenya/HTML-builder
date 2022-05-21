const fs = require('fs');
const path = require('path');
const readline = require('readline');
const word = 'exit';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ws = fs.createWriteStream(path.join(__dirname + '/text.txt'), 'utf8');
rl.question('Hello my dear friend! What is your text?\n', (data) => {
  if (data.trim() === word  ) {
    rl.close();
  }
  
  else {
   
    ws.write(data + '\n');
    rl.on('line', (data) => {
      if (data.trim() === word) {
        rl.close();
      } else {
        
        ws.write(data + '\n');
      }
    });
  }
});

process.stdin.on('keypress', (char, key) =>{
  if (key&& key.ctrl && key.name==='c'){
    rl.close();
    
  }
});

rl.on('close', () => {
  console.log('The end. Good bye my dear friend!');
});
