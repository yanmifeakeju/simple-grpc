import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/random';
import { RandomServerHandlers } from './proto/randomPackage/RandomServer';
import { TodoResponse } from './proto/randomPackage/TodoResponse';
import { TodoRequest } from './proto/randomPackage/TodoRequest';

const PORT = 8080;
const PROTO_FILE = './proto/random.proto';
const packgeDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(
  packgeDef
) as unknown as ProtoGrpcType;
const randomPackage = grpcObj.randomPackage;

const todoList: TodoRequest[] = [];

function main() {
  const server = getServer();

  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`Server listening on port ${port}`);
      server.start();
    }
  );
}

function getServer() {
  const server = new grpc.Server();
  server.addService(randomPackage.RandomServer.service, {
    PingPong: (req, res) => {
      console.log('PingPong');

      res(null, { message: 'Pong' });
    },
    RandomNumbers: (call) => {
      const { maxVal } = call.request;

      let runCount = 0;
      const id = setInterval(() => {
        runCount += 1;
        call.write({ number: Math.floor(Math.random() * maxVal! || 50) });

        if (runCount >= 10) {
          clearInterval(id);
          call.end();
        }
      }, 500);
    },
    TodoList: (call, callback) => {
      call.on('data', (chunk) => {
        todoList.push(chunk);
        console.log(chunk);
      });

      call.on('end', () => {
        callback(null, { todos: todoList });
      });
    }
  } as RandomServerHandlers);

  return server;
}

main();
