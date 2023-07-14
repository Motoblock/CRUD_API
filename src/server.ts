import { createServer } from 'node:http';

import { getApiUser, setApiUser, putApiUser } from './respons';
import { DATA_BASE } from './index';

export const startServer = () => {
  const server = createServer((req, res) => {
    const { method, url } = req;
    if (url) {
      switch (method) {
        case 'GET':
          getApiUser(url, res, DATA_BASE);
          break;
        case 'POST':
          setApiUser(url, req, res, DATA_BASE);
          break;
        case 'PUT':
          putApiUser(url, req, res, DATA_BASE);
          break;
        default:
          console.error(1);
      }
    }
  });
  return server;
};
