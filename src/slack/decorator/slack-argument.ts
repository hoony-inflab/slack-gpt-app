export type SlackArgumentType =
  | typeof PAYLOAD
  | typeof SAY
  | typeof RESPOND
  | typeof EVENT
  | typeof CLIENT
  | typeof ACK;
export const PAYLOAD = Symbol('PAYLOAD');

export function Payload(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(PAYLOAD, parameterIndex, target, propertyKey);
  };
}

export const SAY = Symbol('SAY');

export function Say(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(SAY, parameterIndex, target, propertyKey);
  };
}

export const RESPOND = Symbol('RESPOND');

export function Respond(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(RESPOND, parameterIndex, target, propertyKey);
  };
}

export const EVENT = Symbol.for('EVENT');

export function Event(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(EVENT, parameterIndex, target, propertyKey);
  };
}

export const CLIENT = Symbol.for('CLIENT');

export function Client(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(CLIENT, parameterIndex, target, propertyKey);
  };
}

export const ACK = Symbol('ACK');

export function Ack(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(ACK, parameterIndex, target, propertyKey);
  };
}
