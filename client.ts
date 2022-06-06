import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/random';

const PORT = 8080;
const PROTO_FILE = './proto/random.proto';
const packgeDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(
  packgeDef
) as unknown as ProtoGrpcType;

const client = new grpcObj.randomPackage.RandomServer(
  `0.0.0.0:${PORT}`,
  grpc.credentials.createInsecure()
);

const deadline = new Date();
deadline.setSeconds(deadline.getSeconds() + 5);
client.waitForReady(deadline, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  onClientReady();
});

function onClientReady() {
  /** Server - Client Response */
  // client.PingPong({ message: 'Ping' }, (err, res) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   console.log(res);
  // });
  /** Server Streaming */
  // const stream = client.RandomNumbers({ maxVal: 10 });
  // stream.on('data', (chunk) => {
  //   console.log(chunk);
  // });
  // stream.on('end', () => {
  //   console.log('Completed');
  // });

  /** Client Streaming */

  const stream = client.TodoList((err, res) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(res);
  });

  stream.write({ todo: 'Hello', status: 'Pending' });
  stream.write({ todo: 'World', status: 'Completed' });
  stream.write({ todo: 'Call', status: 'In Progress' });
  stream.end();
}
