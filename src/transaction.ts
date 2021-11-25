import fakeP2P from "./fakeP2P";
import Utils from "./utilities";
import Crypto from "crypto";

export default class Transaction {
  public data: TransactionData;
  private signature: Buffer | undefined;

  constructor(
    payerPublicKey: string,
    payeePublicKey: string,
    amount: number,
    previousHash: string
  ) {
    this.data = new TransactionData(
      payerPublicKey,
      payeePublicKey,
      amount,
      previousHash
    );
  }

  set sign(signature: Buffer) {
    this.signature = signature;
  }

  verify(): boolean {

    console.log('-----------TRANSACTION VERIFICATION-----------');
    

    let { amountReceived, amountSpent } = this.calculateBalance();

    if (this.data.previousHash === "genesis") {
      console.log("genesis");
      return true;
    }

    if (amountReceived - amountSpent < this.data.amount) {
      console.log("Insufficient funds");
      return false;
    }

    const verify = Crypto.createVerify('SHA256');
    verify.update(this.data.toString());
    let result = verify.verify(this.data.payerPublicKey, this.signature as Buffer);
    result ? console.log("Transaction verified") : console.log("Transaction not verified");
    console.log('-----------END-----------');
    return result;
  }
  
  private calculateBalance() {
    const transactionsMade = fakeP2P.getTransactionsBySender(
      this.data.payerPublicKey
    );
    const transactionsReceived = fakeP2P.getTransactionsByReceiver(
      this.data.payerPublicKey
    );

    let amountSpent = 0;
    let amountReceived = 0;

    for (const transaction of transactionsMade) {
      amountSpent += transaction.data.amount;
    }

    for (const transaction of transactionsReceived) {
      amountReceived += transaction.data.amount;
    }
    return { amountReceived, amountSpent };
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
    const hash = Utils.createHash("MD5");
    hash.update(Utils.toString(this).toString()).end();
    this.hash = hash.digest("hex");
  }
}
