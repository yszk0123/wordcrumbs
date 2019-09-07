import filenamify from 'filenamify';
import { promises } from 'fs';
import path from 'path';
import { CACHE_DIR } from './constants';
import { createErr, createOk, isErr, Result } from './Result';
const { readFile, writeFile } = promises;

function getCachePathFromURL(url: string): string {
  const filename = filenamify(url);
  return path.join(CACHE_DIR, filename);
}

export async function tryToFetchBodyFromCacheOr(
  url: string,
  fallback: () => Promise<Result<string, unknown>>,
): Promise<Result<string, unknown>> {
  const cachePath = getCachePathFromURL(url);
  try {
    const content = await readFile(cachePath, 'utf8');
    return createOk(content);
  } catch (error) {
    const result = await fallback();
    if (isErr(result)) {
      return result;
    }

    try {
      await writeFile(cachePath, result.val, 'utf8');
      return createOk(result.val);
    } catch (error) {
      return createErr(error);
    }
  }
}
