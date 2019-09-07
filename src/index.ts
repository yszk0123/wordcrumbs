import 'isomorphic-fetch';
import makeDir from 'make-dir';
import { CACHE_DIR } from './constants';
import { isErr } from './Result';
import { getTokenizer } from './Tokenizer';
import { WordAPI } from './WordAPI';

const URL =
  'https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%B3%E3%83%90%E3%83%BC%E3%82%AC%E3%83%BC%E3%83%9C%E3%82%BF%E3%83%B3';

async function setup() {
  await makeDir(CACHE_DIR);
}

async function main() {
  await setup();

  const tokenizerResult = await getTokenizer();
  if (isErr(tokenizerResult)) {
    return tokenizerResult;
  }

  const wordAPI = new WordAPI(tokenizerResult.val);

  const result = await wordAPI.fetchFromURL(URL);
  if (isErr(result)) {
    console.error(result.val);
    return;
  }

  const words = result.val;
  console.log('========== Words ==========');
  console.log(words.join('\n'));
}

main()
  .then(console.log)
  .catch(console.error);
