//this class implements the mining of the coin, the creation of the block, the verification of the block

import Transaction from "./transaction";
import Utils from "./utilities";

export class Block {

  public transactions: Transaction[] = [];
  public previousHash: string;
  public hash: string = "";
  public nonce: number;

  constructor(previousHash: string) {
    this.previousHash = previousHash;
    this.nonce = Math.random() * 1000000;
  }

  CreateProofOfWork(nonce: number) {
    let solution = 1;
    console.log("⛏️  mining...");

    while (true) {
      const hash = Utils.createHash("MD5");
      hash.update((nonce + solution + Utils.toString(this)).toString()).end();

      const attempt = hash.digest("hex");

      if (attempt.substr(0, 4) === "0000") {
        console.log(`Solved: ${solution} with Hash: ${attempt}`);
        this.hash = attempt;
        break;
      }

      solution += 1;
    }
  }

  async addTransaction(transaction: Transaction) {
    if(this.transactions.length + 1 <= 10) {
      if(transaction.verify()) {
        this.transactions.push(transaction);
      }
    }
  }
}
