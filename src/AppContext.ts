import express from 'express';
import { createOk, isErr, Result } from './Result';
import { getTokenizer } from './Tokenizer';
import { WordAPI } from './WordAPI';

// FIXME
let context: AppContext | null = null;

export interface AppContext {
  wordAPI: WordAPI;
}

export const appContextMiddleWare: express.RequestHandler = async (
  req,
  _res,
  next,
) => {
  if (context !== null) {
    req.context = context;
    next();
    return;
  }

  const contextResult = await createContext();
  if (isErr(contextResult)) {
    next(new Error('Failed to create application context'));
    return;
  }

  context = req.context = contextResult.val;
  next();
};

async function createContext(): Promise<Result<AppContext, unknown>> {
  const tokenizerResult = await getTokenizer();
  if (isErr(tokenizerResult)) {
    return tokenizerResult;
  }

  const wordAPI = new WordAPI(tokenizerResult.val);

  return createOk({
    wordAPI,
  });
}
