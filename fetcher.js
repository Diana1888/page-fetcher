const args = process.argv.slice(2);
const urlAddress = args[0];
const localPath = args[1];
console.log(urlAddress, localPath);


const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


//Making HTTP request
const request = require('request');
request(urlAddress, (error, response, body) => {
  console.log("statusCode:", response && response.statusCode);
  
  //Check if URL is invalid or request is not successful
  if (error || response.statusCode !== 200) {
    return console.log("Your URL is Invalid");
  }
  //Check if path is invalid
  if (!localPath || !localPath.startsWith("./")) {
    return console.log("There is problem with your local path");
  }

  //Check if file Already Exists then ask a message if user wants to overwrite the file
  if (fs.existsSync(localPath)) {
    rl.question(`${localPath} already exists. Do you want to overwrite it (y/n):  `, (answer) => {
      if (answer === 'y') {
        fs.writeFile(localPath, body, () => {
          console.log(`${localPath} file was overwritten`);
        });
        rl.close();
      } else {
        rl.close();
      }
    });
    // If file doesn't exist, then create file
  }  else {
    fs.writeFile(localPath, body, err => {
      if (err) {
        console.error();
        return;
      }
      //get the size of created file
      let stats = fs.statSync(localPath);
      let fileSize = stats.size;
      console.log(`Downloaded and saved ${fileSize} bytes to ${localPath}`);
      return;
    });
  }
});