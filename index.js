const fs = require('fs');
const gfs = require('get-folder-size');
const ls = require('recursive-readdir');

const config = {
  DIR: '.',
  OUTDIR: './out',
  LIMIT_SIZE: 512 // MB
};

const getSize = gfs(config.DIR, (err, result) => {
  if (err) {
    console.log(err);
  }

  let size = result / (1024 * 1024);

  console.log('Folder size: ', size);
  console.log('Limit: ', config.LIMIT_SIZE);
  console.log('-----');

  let dirCounter = 0;
  let dirSizeCounter = 0;

  // let files = fs.readdirSync(config.DIR, {recursive: true});
  let files = ls(config.DIR, (err, files) => {
    if (!fs.existsSync(`${config.OUTDIR}/${dirCounter}`)) {
      console.log();
      console.log(`${config.OUTDIR}/${dirCounter}`);
      fs.mkdirSync(`${config.OUTDIR}/${dirCounter}`);
    }

    files.forEach((file) => {
      file = file.replace(config.DIR + '/', '');
      let fileSize = fs.statSync(`${config.DIR}/${file}`).size / (1024 * 1024);
      console.log(file, dirSizeCounter);

      if (dirSizeCounter + fileSize < config.LIMIT_SIZE) {
        dirSizeCounter += fileSize;
        fs.copyFileSync(`${config.DIR}/${file}`, `${config.OUTDIR}/${dirCounter}/${file.split('/')[file.split('/').length - 1]}`);
      } else {
        dirSizeCounter = 0;
        dirCounter++;
        console.log();
        console.log(`${config.OUTDIR}/${dirCounter}`);
        fs.mkdirSync(`${config.OUTDIR}/${dirCounter}`);

        dirSizeCounter += fileSize;
        fs.copyFileSync(`${config.DIR}/${file}`, `${config.OUTDIR}/${dirCounter}/${file.split('/')[file.split('/').length - 1]}`);
      }
    });
  });
});
