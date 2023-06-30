import { createServer } from 'http';

export const startServer = () => {
  const server = createServer(async (req, _) => {
    const { method, url } = req;
    switch (method) {
      case 'GET':
        if (url) console.log('get user');
        break;
      default: console.error(1);
    }
  });
  return server;
}
