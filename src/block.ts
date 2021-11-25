import Transaction from "./transaction";
import Utils from "./utilities";
import Crypto from "crypto";

export class Block {

  public transactions: Transaction[] = [];
  public previousHash: string;
  public hash: string = "";
  public nonce: number;
  public timestamp = Date.now();

  constructor(previousHash: string) {
    this.previousHash = previousHash;
    this.nonce = Math.random() * 1000000;
  }

  public CreateProofOfWork(nonce: number) {
    let solution = 1;
    console.log("⛏️  mining...");

    while (true) {
      const hash = this.createHash("MD5");
      hash.update((nonce + solution + Utils.toString(this)).toString()).end();

      const attempt = hash.digest("hex");

      if (attempt.substr(0, 4) === "0000") {
        console.log(`⛏️ Solved: ${solution}`);
        this.hash = attempt;
        break;
      }

      solution += 1;
    }
  }

  public addTransaction(transaction: Transaction) {
    if(this.transactions.length + 1 <= 10) {
      if(transaction.verify()) {
        this.transactions.push(transaction);
      }
    }
  }

  private createHash(algorithm : string) : Crypto.Hash {
    return Crypto.createHash(algorithm)
  }
}
