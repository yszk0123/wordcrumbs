import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { appContextMiddleWare } from './AppContext';
import { Search } from './components/Search';
import { WordList } from './components/WordList';
import { debug } from './debug';
import { render } from './render';
import { isErr } from './Result';

export function createServer() {
  const router = express.Router();

  router.get('/', (req, res) => {
    const content = renderToString(<Search />);
    res.write(render(content, {}));
    res.end();
  });

  router.get('/words', async (req, res) => {
    const url = req.query.url;
    debug(url);
    const wordsResult = await req.context.wordAPI.fetchFromURL(url);
    if (isErr(wordsResult)) {
      res.status(500).json();
      return;
    }

    const content = renderToString(<WordList words={wordsResult.val} />);
    res.write(render(content, {}));
    res.end();
  });

  const app = express();
  app.use(appContextMiddleWare);
  app.use(router);

  return app;
}
