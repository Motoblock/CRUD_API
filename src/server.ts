import { createServer } from 'http';

import { getApiUser, setApiUser } from './resp';
// import { IUser } from './variable/type';
import { DATA_BASE } from './index';

// const DATA_BASE: IUser[] = [];


export const startServer = () => {
  const server = createServer((req, res) => {
    const { method, url } = req;
    switch (method) {
      case 'GET':
        if (url) {
         console.log('url',url);
         console.log('bd',DATA_BASE);
          getApiUser(url, res, DATA_BASE);
          console.log('get user');
        }
        break;
        case 'POST':
        if (url) {
         console.log('url',url);
        //  console.log('res',res);
         console.log('bd',DATA_BASE);
          setApiUser(url, req, res, DATA_BASE);
          console.log('push user');
        }
        break;
      default: console.error(1);
    }
  });
  return server;
}
