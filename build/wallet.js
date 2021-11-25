"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var block_1 = require("./block");
var fakeP2P_1 = __importDefault(require("./fakeP2P"));
var transaction_1 = __importDefault(require("./transaction"));
var utilities_1 = __importDefault(require("./utilities"));
var crypto_1 = __importDefault(require("crypto"));
var Wallet = /** @class */ (function () {
    function Wallet() {
        var _a;
        this.amount = 0;
        _a = utilities_1.default.createNewKeyPair(), this.publicKey = _a[0], this.privateKey = _a[1];
    }
    Wallet.prototype.send = function (payeePublicKey, amount) {
        var transaction = this.createSignedTransaction(payeePublicKey, amount);
        fakeP2P_1.default.addTransaction(transaction);
    };
    Wallet.prototype.mine = function () {
        var transaction = fakeP2P_1.default.getTransactions();
        var lastBlockHash = fakeP2P_1.default.getLastBlockHash();
        var block = new block_1.Block(lastBlockHash);
        transaction.forEach(function (transaction) {
            block.addTransaction(transaction);
        });
        block.CreateProofOfWork(block.nonce);
        fakeP2P_1.default.addBlock(block);
    };
    Wallet.prototype.createSignedTransaction = function (payeePublicKey, amount) {
        var previousHash = fakeP2P_1.default.getLastTransactionHash();
        var transaction = new transaction_1.default(this.publicKey, payeePublicKey, amount, previousHash);
        transaction.sign = Wallet.createSignature(transaction.data, this.privateKey);
        return transaction;
    };
    Wallet.createSignature = function (data, privateKey) {
        var sign = crypto_1.default.createSign('SHA256');
        sign.update(data.toString()).end();
        return sign.sign(privateKey);
    };
    return Wallet;
}());
exports.default = Wallet;
