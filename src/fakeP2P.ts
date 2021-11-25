//This is a centralized server that will listen for all broadcasts and store them in the order of arrival
//This will act as if i was broadcasting to all peers, but since i do not know how to implement peer to peer communication,
//i will just store all the messages in a centralized server and send them to all peers when requested
//This fakeP2P will be replaced as soon as i implement peer to peer communication.

import { Block } from "./block";
import Transaction from "./transaction";

class FakeP2P {
  transactions: Transaction[] = [];
  blocks: Block[] = [];

  addTransaction(transaction: Transaction) {
    if (this.transactions.length > 10) {
      this.transactions.shift();
    }
    this.transactions.push(transaction);
  }

  addBlock(block: Block) {
    this.blocks.push(block);
  }

  getBlocks() {
    return this.blocks;
  }

  getLastBlockHash() : string{
    if(this.blocks.length === 0){
      return 'genesis';
    }
    return this.blocks[this.blocks.length - 1].hash;
  }

  getTransactions() {
    return this.transactions;
  }

  getLastTransactionHash() {
    if (this.transactions.length === 0) {
      return "genesis";
    }
    return this.transactions[this.transactions.length - 1].data.hash;
  }

  getTransactionsBySenderBeforeThisOne(payerPublicKey: string, date : number) {
    return this.transactions.filter(
      (transaction) => transaction.data.payerPublicKey === payerPublicKey && transaction.timestamp < date
    );
  }

  getTransactionsByReceiverBeforeThisOne(payeePublicKey: string, date : number) {
    return this.transactions.filter( 
      (transaction) => transaction.data.payeePublicKey === payeePublicKey && transaction.timestamp < date
    );
  }
}

export default new FakeP2P();
