import { ServerResponse, IncomingMessage } from 'http';
import { v4, validate } from 'uuid';

import { IUser } from './variable/type';

async function createDate(request: IncomingMessage, response: ServerResponse): Promise<IUser> {
  console.log(request);
  return new Promise((resolve, reject) => {
    let res = '';
    console.log('res1',res);
    request.on('data', (chunk) => {
      res += chunk.toString();
    });
console.log('res2',res);
    request.on('end', () => {
      try {
        const parsRes = JSON.parse(res);
        console.log('parsedRes',parsRes);
        resolve(parsRes);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const getApiUser = (
  url: string,
  response: ServerResponse,
  DATA_BASE: IUser[]
): void => {
  console.log(url);
  if (url === '/api/users') {
    console.log(response)
    try {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(DATA_BASE));
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message:'ServerError' }));
    }
  } else if (url?.startsWith('/api/users/')) {
    const userId = url.split('/')[3];
    console.log('id',userId);
    const user = DATA_BASE.find((i) => +i.id === +userId);
    if (!userId || !user) {
      console.log('NotFound');
    } else if (!validate(userId)) {
      console.log('BadRequest');
    } else {
      console.log(user)
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(user));
    }
  } else {
    console.log('BadRequest');
  }
};

export const setApiUser = async (
  url: string,
  request: IncomingMessage,
  response: ServerResponse,
  DATA_BASE: IUser[]
): Promise<void> => {
  console.log('url = ',url);
  if (url === '/api/users') {
    try {
      let data: IUser = await createDate(request, response);
      console.log(data);
      if (
        ['username', 'age', 'hobbies'].every((key) => data.hasOwnProperty(key)) &&
        Array.isArray(data.hobbies) && data.username.trim().length > 0
      ) {
        console.log('BadRequest');
      } else {
        const { username, age, hobbies } = data;
        const getUser: IUser = {
          id: +v4(),
          username: username.trim(),
          age: +age,
          hobbies,
        };

        response.writeHead(201, { 'Content-Type': 'application/json' });
        DATA_BASE.push(getUser);
        response.end(JSON.stringify(getUser));
      }
    } catch (error) {
      console.log('InternalServerError 1');
    }
  } else {
    console.log('BadRequest');
  }
};

