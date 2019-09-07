import { JSDOM } from 'jsdom';
import { IpadicFeatures } from 'kuromoji';
import { tryToFetchBodyFromCacheOr } from './Cache';
import { debug } from './debug';
import { createErr, createOk, isErr, Result } from './Result';
import { Tokenizer, TokenPos } from './Tokenizer';

export enum WordType {
  DEFAULT,
  HIGHLIGHT,
}

export type Word =
  | { type: WordType.DEFAULT; value: string }
  | { type: WordType.HIGHLIGHT; value: string };

export class WordAPI {
  constructor(private readonly tokenizer: Tokenizer) {}

  async fetchFromURL(url: string): Promise<Result<Word[], unknown>> {
    return fetchTokensFromURL(url, this.tokenizer);
  }
}

async function fetchTokensFromURL(
  url: string,
  tokenizer: Tokenizer,
): Promise<Result<Word[], unknown>> {
  const windowResult = await getWindowFromURL(url);
  if (isErr(windowResult)) {
    return createErr(windowResult.val);
  }

  const { document } = windowResult.val;
  const content = document.querySelector('#content')!;
  const text = content.textContent || '';
  const tokens = tokenizer.tokenize(text);
  const words = tokens.map(getWordFromToken);
  return createOk(words);
}

function getWordFromToken(token: IpadicFeatures): Word {
  switch (token.pos) {
    case TokenPos.NOUN:
      return { type: WordType.HIGHLIGHT, value: token.surface_form };
    default:
      return { type: WordType.DEFAULT, value: token.surface_form };
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
