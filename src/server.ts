import { createServer } from 'node:http';

import { getApiUser, setApiUser, putApiUser, delApiUser } from './respons.js';
import { DATA_BASE } from './index.js';

export const startServer = () => {
  const server = createServer((req, res) => {
    const { method, url } = req;
    // console.log(`Server running at http://localhost:${port}/`);
    if (url) {
      console.log(process.pid);
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
        case 'DELETE':
          delApiUser(url, req, res, DATA_BASE);
          break;
        default:
          console.error(1);
      }
    }
  });
  return server;
};
