"use strict";
//This is a centralized server that will listen for all broadcasts and store them in the order of arrival
//This will act as if i was broadcasting to all peers, but since i do not know how to implement peer to peer communication,
//i will just store all the messages in a centralized server and send them to all peers when requested
//This fakeP2P will be replaced as soon as i implement peer to peer communication.
Object.defineProperty(exports, "__esModule", { value: true });
var FakeP2P = /** @class */ (function () {
    function FakeP2P() {
        this.transactions = [];
        this.blocks = [];
    }
    FakeP2P.prototype.addTransaction = function (transaction) {
        if (this.transactions.length > 10) {
            this.transactions.shift();
        }
        this.transactions.push(transaction);
    };
    FakeP2P.prototype.addBlock = function (block) {
        this.blocks.push(block);
    };
    FakeP2P.prototype.getBlocks = function () {
        return this.blocks;
    };
    FakeP2P.prototype.getLastBlockHash = function () {
        if (this.blocks.length === 0) {
            return 'genesis';
        }
        return this.blocks[this.blocks.length - 1].hash;
    };
    FakeP2P.prototype.getTransactions = function () {
        return this.transactions;
    };
    FakeP2P.prototype.getLastTransactionHash = function () {
        if (this.transactions.length === 0) {
            return "genesis";
        }
        return this.transactions[this.transactions.length - 1].data.hash;
    };
    FakeP2P.prototype.getTransactionsBySenderBeforeThisOne = function (payerPublicKey, date) {
        return this.transactions.filter(function (transaction) { return transaction.data.payerPublicKey === payerPublicKey && transaction.timestamp < date; });
    };
    FakeP2P.prototype.getTransactionsByReceiverBeforeThisOne = function (payeePublicKey, date) {
        return this.transactions.filter(function (transaction) { return transaction.data.payeePublicKey === payeePublicKey && transaction.timestamp < date; });
    };
    return FakeP2P;
}());
exports.default = new FakeP2P();
