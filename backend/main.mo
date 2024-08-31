import Nat "mo:base/Nat";

import Float "mo:base/Float";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

actor {
  // Stable variables
  stable var balance : Float = 0.0;
  stable var transactions : [Transaction] = [];

  // Types
  type Transaction = {
    id : Nat;
    amount : Float;
    recipient : Text;
    sender : Text;
    note : ?Text;
    timestamp : Time.Time;
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

  public func sendMoney(recipient : Text, amount : Float, note : ?Text) : async Result.Result<(), Text> {
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
      sender = "self";
      note = note;
      timestamp = Time.now();
      transactionType = #send;
    };
    transactions := Array.append(transactions, [transaction]);
    #ok()
  };

  public func requestMoney(from : Text, amount : Float, note : ?Text) : async Result.Result<(), Text> {
    if (amount <= 0) {
      return #err("Amount must be greater than zero");
    };

    let transaction : Transaction = {
      id = generateTransactionId();
      amount = amount;
      recipient = "self";
      sender = from;
      note = note;
      timestamp = Time.now();
      transactionType = #request;
    };
    transactions := Array.append(transactions, [transaction]);
    #ok()
  };

  public query func getTransactionHistory() : async [Transaction] {
    return transactions;
  };

  public query func generateQRCode() : async Text {
    // In a real implementation, this would generate a proper QR code
    // For this MVP, we'll just return a placeholder string
    return "QR_CODE_PLACEHOLDER";
  };

  // For development purposes only
  public func addFunds(amount : Float) : async () {
    balance += amount;
    Debug.print("Added funds: " # Float.toText(amount));
  };
}
