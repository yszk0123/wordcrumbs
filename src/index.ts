import 'isomorphic-fetch';
import makeDir from 'make-dir';
import { CACHE_DIR } from './constants';
import { createServer } from './Server';

const PORT = 3000;

const URL =
  'https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%B3%E3%83%90%E3%83%BC%E3%82%AC%E3%83%BC%E3%83%9C%E3%82%BF%E3%83%B3';

async function setup() {
  await makeDir(CACHE_DIR);
}

async function main() {
  const server = createServer();

  server.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
  });
}

main()
  .then(console.log)
  .catch(console.error);
