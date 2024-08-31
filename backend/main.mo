import Int "mo:base/Int";
import Nat "mo:base/Nat";

import Float "mo:base/Float";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

actor {
  // Stable variables
  stable var balance : Float = 0.0;
  stable var transactions : [Transaction] = [];

  // Types
  type Transaction = {
    id : Nat;
    amount : Float;
    recipient : Principal;
    sender : Principal;
    note : ?Text;
    timestamp : Int;
    transactionType : {#send; #request};
  };

  // Helper functions
  func generateTransactionId() : Nat {
    return transactions.size();
  };

  // API methods
  public query func getBalance() : async Float {
    return balance;
  };

  public shared(msg) func sendMoney(recipient : Principal, amount : Float, note : ?Text) : async Result.Result<(), Text> {
    if (amount <= 0) {
      return #err("Amount must be greater than zero");
    };
    if (amount > balance) {
      return #err("Insufficient funds");
    };

    balance -= amount;
    let transaction : Transaction = {
      id = generateTransactionId();
      amount = amount;
      recipient = recipient;
      sender = msg.caller;
      note = note;
      timestamp = Time.now();
      transactionType = #send;
    };
    transactions := Array.append(transactions, [transaction]);
    #ok(())
  };

  public shared(msg) func requestMoney(from : Principal, amount : Float, note : ?Text) : async Result.Result<(), Text> {
    if (amount <= 0) {
      return #err("Amount must be greater than zero");
    };

    let transaction : Transaction = {
      id = generateTransactionId();
      amount = amount;
      recipient = msg.caller;
      sender = from;
      note = note;
      timestamp = Time.now();
      transactionType = #request;
    };
    transactions := Array.append(transactions, [transaction]);
    #ok(())
  };

  public query func getTransactionHistory() : async [Transaction] {
    return transactions;
  };

  public query({caller}) func getMyPrincipalId() : async Principal {
    return caller;
  };

  // For development purposes only
  public func addFunds(amount : Float) : async () {
    balance += amount;
    Debug.print("Added funds: " # Float.toText(amount));
  };
}
