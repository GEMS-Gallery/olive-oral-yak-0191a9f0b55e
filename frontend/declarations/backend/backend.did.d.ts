import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export type Time = bigint;
export interface Transaction {
  'id' : bigint,
  'transactionType' : { 'request' : null } |
    { 'send' : null },
  'note' : [] | [string],
  'recipient' : string,
  'sender' : string,
  'timestamp' : Time,
  'amount' : number,
}
export interface _SERVICE {
  'addFunds' : ActorMethod<[number], undefined>,
  'generateQRCode' : ActorMethod<[], string>,
  'getBalance' : ActorMethod<[], number>,
  'getTransactionHistory' : ActorMethod<[], Array<Transaction>>,
  'requestMoney' : ActorMethod<[string, number, [] | [string]], Result>,
  'sendMoney' : ActorMethod<[string, number, [] | [string]], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
