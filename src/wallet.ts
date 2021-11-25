import { Block } from "./block";
import FakeP2P from "./fakeP2P";
import Transaction, { TransactionData } from "./transaction";
import Utils from "./utilities";
import Crypto from 'crypto';

export default class Wallet {
  public publicKey: string;
  private privateKey: string;
  public amount: number = 0;

  constructor() {
    [this.publicKey, this.privateKey] = Utils.createNewKeyPair();
  }

  public send(payeePublicKey: string, amount: number) {
    const transaction = this.createSignedTransaction(payeePublicKey, amount);
    FakeP2P.addTransaction(transaction);
  }

  public mine() {
    let transaction = FakeP2P.getTransactions();
    let lastBlockHash = FakeP2P.getLastBlockHash();

    const block = new Block(lastBlockHash);
    transaction.forEach(transaction => {
      block.addTransaction(transaction);
    });

    block.CreateProofOfWork(block.nonce);
    FakeP2P.addBlock(block);
  }

  private createSignedTransaction(
    payeePublicKey: string,
    amount: number
  ): Transaction {
    const previousHash = FakeP2P.getLastTransactionHash();
    const transaction = new Transaction(this.publicKey, payeePublicKey, amount, previousHash);
    transaction.sign = Wallet.createSignature(transaction.data, this.privateKey);
    return transaction;
  }

  private static createSignature(
    data: TransactionData,
    privateKey: string
  ): Buffer {
    const sign = Crypto.createSign('SHA256');
    sign.update(data.toString()).end();
    return sign.sign(privateKey); 
  }
}
