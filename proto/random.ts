import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { RandomServerClient as _randomPackage_RandomServerClient, RandomServerDefinition as _randomPackage_RandomServerDefinition } from './randomPackage/RandomServer';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  randomPackage: {
    NumberRequest: MessageTypeDefinition
    NumberResponse: MessageTypeDefinition
    PingRequest: MessageTypeDefinition
    PongResponse: MessageTypeDefinition
    RandomServer: SubtypeConstructor<typeof grpc.Client, _randomPackage_RandomServerClient> & { service: _randomPackage_RandomServerDefinition }
    TodoRequest: MessageTypeDefinition
    TodoResponse: MessageTypeDefinition
  }
}

