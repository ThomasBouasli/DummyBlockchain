import fakeP2P from "./fakeP2P";
import Utils from "./utilities";
import Crypto from "crypto";

export default class Transaction {
  public data: TransactionData;
  public signature: Buffer | undefined;
  public payerName : string = '';
  public payeeName : string = '';
  public timestamp = Date.now();

  constructor(
    payerPublicKey: string,
    payeePublicKey: string,
    amount: number,
    previousHash: string,
    payeeName?: string,
    payerName?: string
  ) {
    this.data = new TransactionData(
      payerPublicKey,
      payeePublicKey,
      amount,
      previousHash
    );
    if(payeeName){
      this.payeeName = payeeName;
    }
    if(payerName){
      this.payerName = payerName;
    }
  }

  verify(): boolean {
    let { balance } = this.calculateBalance();

    if (this.data.previousHash === "genesis") {
      console.log("🧬 GENESIS 🧬");
      return true;
    }

    if (balance < this.data.amount) {
      console.warn(`Tried to spend ${this.data.amount} with only ${balance}`);
      return false;
    }

    const verify = Crypto.createVerify('SHA256');
    verify.update(this.data.toString());
    let result = verify.verify(this.data.payerPublicKey, this.signature as Buffer);
    return result;
  }
  
  private calculateBalance() {
    
    
    const transactionsMade = fakeP2P.getTransactionsBySenderBeforeThisOne(
      this.data.payerPublicKey,
      this.timestamp
    );

    const transactionsReceived = fakeP2P.getTransactionsByReceiverBeforeThisOne(
      this.data.payerPublicKey,
      this.timestamp
    );

    let transactionsMadeIgnoringThis = transactionsMade.filter(
      transaction => transaction.data.previousHash !== this.data.previousHash
    );

    let amountSpent = 0;
    let amountReceived = 0;

    for (const transaction of transactionsMadeIgnoringThis) {
      amountSpent += transaction.data.amount;
    }

    for (const transaction of transactionsReceived) {
      amountReceived += transaction.data.amount;
    }

    let balance = amountReceived - amountSpent;

    return { balance, amountReceived, amountSpent };
  }

  public log(){
    console.log(`💸Transaction from ${this.payerName} to ${this.payeeName} with amount of ${this.data.amount}`)
  }
}

export class TransactionData {
  public hash: string;
  constructor(
    public payerPublicKey: string,
    public payeePublicKey: string,
    public amount: number,
    public previousHash: string
  ) {
    const hash = this.createHash("MD5");
    hash.update(Utils.toString(this).toString()).end();
    this.hash = hash.digest("hex");
  }

  private createHash(algorithm : string) : Crypto.Hash {
    return Crypto.createHash(algorithm)
  }
}
