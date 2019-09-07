import 'isomorphic-fetch';
import { JSDOM } from 'jsdom';
import { IpadicFeatures } from 'kuromoji';
import makeDir from 'make-dir';
import { tryToFetchBodyFromCacheOr } from './Cache';
import { CACHE_DIR } from './constants';
import { debug } from './debug';
import { createErr, createOk, isErr, Result } from './Result';
import { getTokenizer, Tokenizer, TokenPos } from './Tokenizer';

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

  const result = await doProcess(tokenizerResult.val);
  if (isErr(result)) {
    console.error(result.val);
    return;
  }

  const words = result.val;
  console.log('========== Words ==========');
  console.log(words.join('\n'));
}

async function doProcess(
  tokenizer: Tokenizer,
): Promise<Result<Word[], unknown>> {
  const url = URL;
  const windowResult = await getWindowFromURL(url);
  if (isErr(windowResult)) {
    return createErr(windowResult.val);
  }

  const { document } = windowResult.val;
  const content = document.querySelector('#content')!;
  const text = content.textContent || '';

  const tokens = tokenizer.tokenize(text);
  const words = tokens
    .filter(token => token.pos === TokenPos.NOUN)
    .map(getWordFromToken);

  return createOk(words);
}

enum WordType {
  DEFAULT,
  HIGHLIGHT,
}

type Word =
  | { type: WordType.DEFAULT; value: string }
  | { type: WordType.HIGHLIGHT; value: string };

function getWordFromToken(token: IpadicFeatures): Word {
  switch (token.pos) {
    case TokenPos.NOUN:
      return { type: WordType.HIGHLIGHT, value: token.basic_form };
    default:
      return { type: WordType.DEFAULT, value: token.basic_form };
  }
}

async function getWindowFromURL(url: string): Promise<Result<Window, unknown>> {
  const bodyResult = await getBodyFromURL(url);
  if (isErr(bodyResult)) {
    return bodyResult;
  }

  try {
    const dom = new JSDOM(bodyResult.val);
    return createOk(dom.window);
  } catch (error) {
    debug(`Failed to parse html`);
    return createErr(error);
  }
}

async function getBodyFromURL(url: string): Promise<Result<string, unknown>> {
  return tryToFetchBodyFromCacheOr(url, async () => {
    const response = await fetch(url);
    if (response.status !== 200) {
      return createErr(`Failed to fetch "${url}"`);
    }

    try {
      const body = await response.text();
      return createOk(body);
    } catch (error) {
      debug(`Failed to parse body "${url}"`);
      return createErr(error);
    }
  });
}

main()
  .then(console.log)
  .catch(console.error);
