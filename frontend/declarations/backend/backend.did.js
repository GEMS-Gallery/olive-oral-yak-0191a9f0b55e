export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Transaction = IDL.Record({
    'id' : IDL.Nat,
    'transactionType' : IDL.Variant({
      'request' : IDL.Null,
      'send' : IDL.Null,
    }),
    'note' : IDL.Opt(IDL.Text),
    'recipient' : IDL.Text,
    'sender' : IDL.Text,
    'timestamp' : Time,
    'amount' : IDL.Float64,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'addFunds' : IDL.Func([IDL.Float64], [], []),
    'generateQRCode' : IDL.Func([], [IDL.Text], ['query']),
    'getBalance' : IDL.Func([], [IDL.Float64], ['query']),
    'getTransactionHistory' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
    'requestMoney' : IDL.Func(
        [IDL.Text, IDL.Float64, IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
    'sendMoney' : IDL.Func(
        [IDL.Text, IDL.Float64, IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
