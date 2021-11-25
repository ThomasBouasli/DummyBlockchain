import Wallet from "./wallet";
import "./block";
import FakeP2P from "./fakeP2P";
import Transaction from "./transaction";

let satoshiWallet = new Wallet();
FakeP2P.addTransaction(new Transaction("genesis", satoshiWallet.publicKey, 100, "genesis"));
let thomasWallet = new Wallet();

satoshiWallet.send(thomasWallet.publicKey, 25);
satoshiWallet.send(thomasWallet.publicKey, 25);
thomasWallet.mine();



FakeP2P.getBlocks().forEach((block) => {
  console.log(block);
});
