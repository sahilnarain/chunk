const fs = require('fs');
const gfs = require('get-folder-size');

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

  let dirCounter = 0;
  let dirSizeCounter = 0;

  let files = fs.readdirSync(config.DIR, {recursive: true});
  if (!fs.existsSync(`${config.OUTDIR}/${dirCounter}`)) {
    console.log(`${config.OUTDIR}/${dirCounter}`);
    fs.mkdirSync(`${config.OUTDIR}/${dirCounter}`);
  }

  files.forEach((file) => {
    console.log(file, dirSizeCounter);
    let fileSize = fs.statSync(`${config.DIR}/${file}`).size / (1024 * 1024);
    if (dirSizeCounter + fileSize < config.LIMIT_SIZE) {
      dirSizeCounter += fileSize;
      fs.copyFileSync(`${config.DIR}/${file}`, `${config.OUTDIR}/${dirCounter}/${file}`);
    } else {
      dirSizeCounter = 0;
      dirCounter++;
      console.log(`${config.OUTDIR}/${dirCounter}`);
      fs.mkdirSync(`${config.OUTDIR}/${dirCounter}`);

      dirSizeCounter += fileSize;
      fs.copyFileSync(`${config.DIR}/${file}`, `${config.OUTDIR}/${dirCounter}/${file}`);
    }
  });
});
