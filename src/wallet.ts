import { Block } from "./block";
import FakeP2P from "./fakeP2P";
import Transaction, { TransactionData } from "./transaction";
import Crypto from 'crypto';

export default class Wallet {
  private name: string;
  public publicKey: string;
  private privateKey: string;
  public amount: number = 0;

  constructor(name: string) {
    [this.publicKey, this.privateKey] = this.createNewKeyPair();
    this.name = name;
  }

  public send(payeePublicKey: string, amount: number) {
    const transaction = this.createSignedTransaction(payeePublicKey, amount);
    FakeP2P.addTransaction(transaction);
  }

  public DEBUG_SendMoneyWithName(payeePublicKey: string, payeeName : string, amount: number) {
    const transaction = this.createSignedTransaction(payeePublicKey, amount);
    transaction.payeeName = payeeName;
    transaction.payerName = this.name;
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
    const transaction = this.createTransaction(payeePublicKey, amount);
    transaction.signature = this.createSignature(transaction.data, this.privateKey);
    return transaction;
  }

  private createSignature(
    data: TransactionData,
    privateKey: string
  ): Buffer {
    const sign = Crypto.createSign('SHA256');
    sign.update(data.toString()).end();
    return sign.sign(privateKey); 
  }

  private createTransaction(payeePublicKey: string, amount: number) {
    const previousHash = FakeP2P.getLastTransactionHash();
    const transaction = new Transaction(this.publicKey, payeePublicKey, amount, previousHash);
    return transaction;
  }

  private createNewKeyPair(): Array<string> {
    let keyPair = Crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    return [keyPair.publicKey, keyPair.privateKey];
  }
}
