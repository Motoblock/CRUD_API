import { ServerResponse } from 'node:http';

export const putMessage = (response: ServerResponse, codeStatus: number) => {
  let message = '';
  if (codeStatus === 400) message = '400 BadRequest';
  else if (codeStatus === 404) message = '404 Not Found';
  else if (codeStatus === 500) message = '500 Internal Server Error';
  response.writeHead(codeStatus, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ message: message }));
};
