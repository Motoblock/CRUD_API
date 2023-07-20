import * as dotenv from 'dotenv';
import cluster from 'node:cluster';
import { cpus } from 'node:os';

import { startServer } from './server';
import { IUser } from './variable/type';

const port = process.env.PORT || 4000;
const ports = process.env.PORTS || 4001;

dotenv.config();

export let DATA_BASE: IUser[] = [
  { id: '46b71936-3b2b-4d48-9763-0f753cb37b99', username: 'name1', age: 12, hobbies: ['sport', 'reed book'] },
  { id: '2e0417c5-30f2-48f6-9a94-ab6637727156', username: 'name2', age: 20, hobbies: ['eat', 'sport'] },
];

try {
  const args = process.argv.slice(2);
  let server;
  if (args.length) {
    server = startServer();
    console.log(`Server running at port ${ports}`);

    if (cluster.isPrimary) {
      console.log(`Process start ${process.pid}`);
      cpus().forEach((_, i) => {
        const portServ = +ports + i;

        cluster.fork({ PORTS: portServ });
        cluster.on('message', async (worker, message) => {
          worker.send(message);
        });
      });
    }
    if (cluster.isWorker) {
      server.listen(process.env.PORTS, () => console.info(`Worker ${process.pid} started`));
      process.on('message', (message: IUser[]) => {
        DATA_BASE = message;
      });
    }
  } else {
    server = startServer();
    server.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  }
} catch (e) {
  process.stderr.write(`Server error - ${e}`);
  process.exit();
}
