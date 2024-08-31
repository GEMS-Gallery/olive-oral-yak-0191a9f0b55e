export const idlFactory = ({ IDL }) => {
  const Transaction = IDL.Record({
    'id' : IDL.Nat,
    'transactionType' : IDL.Variant({
      'request' : IDL.Null,
      'send' : IDL.Null,
    }),
    'note' : IDL.Opt(IDL.Text),
    'recipient' : IDL.Principal,
    'sender' : IDL.Principal,
    'timestamp' : IDL.Int,
    'amount' : IDL.Float64,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'addFunds' : IDL.Func([IDL.Float64], [], []),
    'getBalance' : IDL.Func([], [IDL.Float64], ['query']),
    'getMyPrincipalId' : IDL.Func([], [IDL.Principal], ['query']),
    'getTransactionHistory' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
    'requestMoney' : IDL.Func(
        [IDL.Principal, IDL.Float64, IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
    'sendMoney' : IDL.Func(
        [IDL.Principal, IDL.Float64, IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
