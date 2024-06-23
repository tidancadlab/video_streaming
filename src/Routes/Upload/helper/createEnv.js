const { randomUUID } = require('crypto');

const statusObject = {};
const createEnv = (req, res) => {
  console.log(req.file);
  const id = randomUUID();
  const item = new Array(8).fill(false);
  statusObject[id] = item.reduce(
    (obj, v, i) => ({
      ...obj,
      [i]: {
        offset: 546541,
        chunkSize: 562544125,
      },
    }),
    [],
  );
  statusObject[id][2] = {
    offset: 0,
    chunkSize: 256,
  };
  // const buffer = new ArrayBuffer(100);
  // const aar = new Uint8Array(buffer).fill(-1, 2, 20);
  // console.log(aar);
  res.send(statusObject);
};

module.exports = createEnv;
