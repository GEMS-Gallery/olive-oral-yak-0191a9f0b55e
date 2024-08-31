import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export interface Transaction {
  'id' : bigint,
  'transactionType' : { 'request' : null } |
    { 'send' : null },
  'note' : [] | [string],
  'recipient' : Principal,
  'sender' : Principal,
  'timestamp' : bigint,
  'amount' : number,
}
export interface _SERVICE {
  'addFunds' : ActorMethod<[number], undefined>,
  'getBalance' : ActorMethod<[], number>,
  'getMyPrincipalId' : ActorMethod<[], Principal>,
  'getTransactionHistory' : ActorMethod<[], Array<Transaction>>,
  'requestMoney' : ActorMethod<[Principal, number, [] | [string]], Result>,
  'sendMoney' : ActorMethod<[Principal, number, [] | [string]], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
