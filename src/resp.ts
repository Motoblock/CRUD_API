import { ServerResponse, IncomingMessage } from 'http';
import { v4 } from 'uuid';

import { IUser } from './variable/type';


export const getApiUser = (
  url: string,
  response: ServerResponse,
  DATA_BASE: IUser[]
): void => {
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
    const id = url.split('/')[3];


    if (!id) {
      console.log('NotFound');
    } else {
      const user = DATA_BASE.find((i) => +i.id === +id);
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
  // console.log(response)
  // console.log(request)
  if (url === '/api/users') {
    try {
      let data: IUser = await createDate(request);
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

        response.writeHead(201, {
          'Content-Type': 'application/json',
        });
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

const createDate =  async (request: IncomingMessage): Promise<IUser> => {
  return new Promise((resolve, reject) => {
    let res = '';

    request.on('data', (chunk) => {
      res += chunk.toString();
    });
console.log(res);
    request.on('end', () => {
      try {
        const parsedRes = JSON.parse(res);
        resolve(parsedRes);
      } catch (error) {
        reject(error);
      }
    });
  });
};