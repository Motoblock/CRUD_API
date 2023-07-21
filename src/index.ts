import * as dotenv from 'dotenv';
import cluster from 'node:cluster';
import { cpus, availableParallelism } from 'node:os';
import http from 'node:http';

import { startServer } from './server.js';
import { portToPicker } from './lib/picker.js';
import { IUser } from './variable/type.js';

const port = process.env.PORT || '4000';
const host = process.env.HOST;

dotenv.config();

export const DATA_BASE: IUser[] = [
  { id: '46b71936-3b2b-4d48-9763-0f753cb37b99', username: 'name1', age: 12, hobbies: ['sport', 'reed book'] },
  { id: '2e0417c5-30f2-48f6-9a94-ab6637727156', username: 'name2', age: 20, hobbies: ['eat', 'sport'] },
];

try {
  const args = process.argv.slice(2);
  let server;
  if (args.length) {
    if (cluster.isPrimary) {
      for (let i = 1; i < cpus().length; i++) {
        const portServ = +port + i;

        cluster.fork({ PORT: portServ });
      }
      const parallel = availableParallelism() - 1;

      let currentPort = port;

      const loadBalancer = http.createServer((req, res) => {
        console.log('parallel', parallel);
        console.log('1currentPort1', currentPort);
        currentPort = portToPicker(currentPort, parallel);
        console.log('currentPort2', currentPort);
        const options = {
          hostname: host,
          port: currentPort,
          path: req.url,
          method: req.method,
          json: true,
        };
        const request = http.request(options, (resp) => {
          resp.pipe(res);
        });
        req.pipe(request);
        console.info(`Request send to ${currentPort} port`);
      });
      loadBalancer.listen(port, () => {
        console.info(`Load Balancer running at ${port}\nWorker ${process.pid} started`);
      });
    } else {
      server = startServer();
      server.listen(port, () => console.info(`Worker ${process.pid} started\nServer running at port ${port}`));
    }
  } else {
    server = startServer();
    server.listen(port, () => {
      console.info(`Server running at port ${port}`);
    });
  }
  process.on('SIGINT', () => {
    process.exit();
  });
} catch (e) {
  process.stderr.write(`Server error - ${e}`);
  process.exit();
}
