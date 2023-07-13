import { ServerResponse, IncomingMessage } from 'node:http';
import { v4, validate } from 'uuid';

import { IUser } from './variable/type';

async function createDate(request: IncomingMessage): Promise<Omit<IUser, 'id'>> {
  return new Promise((resolve, reject) => {
    let res = '';
    request.on('data', (chunk) => (res += chunk));
    request.on('end', () => {
      try {
        const parsRes = JSON.parse(res);
        resolve(parsRes);
      } catch (error) {
        reject(error);
      }
    });
  });
}

export const getApiUser = (url: string, response: ServerResponse, DATA_BASE: IUser[]): void => {
  if (url === '/api/users') {
    try {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(DATA_BASE));
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'ServerError' }));
    }
  } else if (url?.startsWith('/api/users/')) {
    const userId = url.split('/')[3];
    const user = DATA_BASE.find((i) => i.id === userId);

    if (!userId || !user) {
      console.log('NotFound');
    } else if (!validate(userId)) {
      console.log('BadRequest');
    } else {
      console.log(user);
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
  if (url === '/api/users') {
    try {
      const data = await createDate(request);
      if (
        ['username', 'age', 'hobbies'].every((key) => Object.keys(data).includes(key)) &&
        Array.isArray(data.hobbies) &&
        data.username.trim().length > 0 &&
        data.age > 0 &&
        data.hobbies.length > 0
      ) {
        const { username, age, hobbies } = data;
        const getUser: IUser = {
          id: v4(),
          username: username.trim(),
          age: +age,
          hobbies,
        };

        response.writeHead(201, { 'Content-Type': 'application/json' });
        DATA_BASE.push(getUser);
        response.end(JSON.stringify(getUser));
        console.log(DATA_BASE);
      } else {
        console.log('BadRequest');
      }
    } catch (error) {
      console.log('InternalServerError');
    }
  } else {
    console.log('BadRequest');
  }
};
