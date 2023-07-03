import * as dotenv from 'dotenv';
import cluster from 'cluster';
import { cpus } from 'os';
// import http from 'node:http';
// import { availableParallelism } from 'node:os';

import { startServer } from './server';
import { IUser } from './variable/type';

const port = process.env.PORT || 4000;
const ports = process.env.PORTS || 4001;

dotenv.config();
export let DATA_BASE: IUser[] = [
{ id: '46b71936-3b2b-4d48-9763-0f753cb37b99',
  username: 'asd',
  age: 12,
  hobbies: ['123','12']
},
{ id: '2e0417c5-30f2-48f6-9a94-ab6637727156',
  username: 'qqasd',
  age: 20,
  hobbies: ['123','12']
}

];

try {
  const server = startServer();
  const args = process.argv.slice(2);

  if (args.length) {
    console.log(`Server running at port ${ports}`);

    if (cluster.isPrimary) {
      console.log(`Process start ${process.pid}`)
      cpus().forEach((_, i) => {
        const portServ = +ports + i;

        cluster.fork({ PORTS: portServ });
        cluster.on('message', async (worker, message) => {
          worker.send(message);
        });
      })
      if (cluster.isWorker) {
        server.listen(process.env.PORTS, () => console.log(`Worker started on ${process.pid}`));
        process.on('message', (message: IUser[]) => {
          DATA_BASE = message;
        });
      }
    }

//     let numReqs = 0;
//     // Подсчет запросов
//     function messageHandler(msg: any) {
//         if (msg.cmd && msg.cmd === 'notifyRequest') {
//             numReqs += 1;
//         }
//     }

//     // Запускаем рабочих и слушаем сообщения, содержащие notifyRequest
//     const numCPUs = availableParallelism();
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }
// console.log(cluster.workers);
//     for (const id in cluster.workers) {
//         cluster.workers[id].on('message', messageHandler);
//     }
  } else {
    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }

} catch (e) {
  process.stderr.write(`Server error - ${e}`);
  process.exit();
}