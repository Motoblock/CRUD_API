import { ServerResponse, IncomingMessage } from 'node:http';
import { v4, validate } from 'uuid';

import { IUser } from './variable/type';
import { putMessage } from './lib/answer';

async function createData(request: IncomingMessage): Promise<Omit<IUser, 'id'>> {
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

    if (!validate(userId)) {
      putMessage(response, 400);
      return;
    }
    const user = DATA_BASE.find((i) => i.id === userId);

    if (!userId || !user) {
      putMessage(response, 404);
    } else {
      response.writeHead(201, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(user));
    }
  } else {
    putMessage(response, 400);
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
      const data = await createData(request);
      if (
        ['username', 'age', 'hobbies'].every((key) => Object.keys(data).includes(key)) &&
        Array.isArray(data.hobbies) &&
        data.username.trim().length > 0 &&
        data.age > 0 &&
        data.hobbies.length > 0
      ) {
        const getUser: IUser = {
          id: v4(),
          username: data.username.trim(),
          age: +data.age,
          hobbies: data.hobbies,
        };

        response.writeHead(201, { 'Content-Type': 'application/json' });
        DATA_BASE.push(getUser);
        response.end(JSON.stringify(getUser));
      } else {
        putMessage(response, 400);
      }
    } catch (error) {
      putMessage(response, 500);
    }
  } else {
    putMessage(response, 400);
  }
};

export const putApiUser = async (
  url: string,
  request: IncomingMessage,
  response: ServerResponse,
  DATA_BASE: IUser[]
): Promise<void> => {
  if (url?.startsWith('/api/users/')) {
    const userId = url.split('/')[3];
    if (!validate(userId)) {
      putMessage(response, 400);
      return;
    }
    const i = DATA_BASE.findIndex((index) => index.id === userId);

    if (i === undefined) putMessage(response, 404);
    else {
      try {
        const data = await createData(request);
        const editUser: IUser = {
          id: userId,
          username: data.username.trim(),
          age: +data.age,
          hobbies: data.hobbies,
        };

        DATA_BASE[i] = editUser;
        response.writeHead(200, {
          'Content-Type': 'application/json',
        });
        response.end(JSON.stringify(editUser));
      } catch (er) {
        console.log(er);
      }
    }
  }
};

export const delApiUser = async (
  url: string,
  request: IncomingMessage,
  response: ServerResponse,
  DATA_BASE: IUser[]
): Promise<void> => {
  if (url?.startsWith('/api/users/')) {
    const userId = url.split('/')[3];
    if (!validate(userId)) {
      putMessage(response, 400);
      return;
    }
    const i = DATA_BASE.findIndex((index) => index.id === userId);

    if (i === undefined) putMessage(response, 404);
    else {
      try {
        DATA_BASE.splice(i, i + 1);
        response.writeHead(204, {
          'Content-Type': 'application/json',
        });
        response.end(JSON.stringify(DATA_BASE));
      } catch (er) {
        console.log(er);
      }
    }
  }
};
