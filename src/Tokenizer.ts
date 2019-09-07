import kuromoji, { IpadicFeatures } from 'kuromoji';
import { KUROMOJI_DIC_PATH } from './constants';
import { createErr, createOk, Result } from './Result';

export type Tokenizer = kuromoji.Tokenizer<IpadicFeatures>;

export enum TokenPos {
  NOUN = '名詞',
}

export async function getTokenizer(): Promise<Result<Tokenizer, unknown>> {
  return new Promise(resolve => {
    kuromoji
      .builder({ dicPath: KUROMOJI_DIC_PATH })
      .build((error, tokenizer) => {
        if (error) {
          resolve(createErr(error));
        } else {
          resolve(createOk(tokenizer));
        }
      });
  });
}
