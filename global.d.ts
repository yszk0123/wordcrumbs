import { AppContext } from './src/AppContext';

declare module 'express-serve-static-core' {
  export interface Request {
    context: AppContext;
  }
}
