import Wallet from "./wallet";
import "./block";
import FakeP2P from "./fakeP2P";
import Transaction from "./transaction";

let satoshiWallet = new Wallet('Satoshi');
FakeP2P.addTransaction(new Transaction("genesis", satoshiWallet.publicKey, 100, "genesis"));



let thomasWallet = new Wallet('Thomas');

satoshiWallet.DEBUG_SendMoneyWithName(thomasWallet.publicKey,'Thomas' ,25);
satoshiWallet.DEBUG_SendMoneyWithName(thomasWallet.publicKey, 'Thomas', 25);
thomasWallet.DEBUG_SendMoneyWithName(satoshiWallet.publicKey, 'Satoshi', 50);
thomasWallet.DEBUG_SendMoneyWithName(satoshiWallet.publicKey, 'Satoshi', 10);
satoshiWallet.DEBUG_SendMoneyWithName(thomasWallet.publicKey, 'Thomas', 10);
thomasWallet.mine();

FakeP2P.getBlocks().forEach(block => {
  block.transactions.forEach(transaction => {
    transaction.log();
  });
});