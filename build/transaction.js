"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionData = void 0;
var fakeP2P_1 = __importDefault(require("./fakeP2P"));
var utilities_1 = __importDefault(require("./utilities"));
var crypto_1 = __importDefault(require("crypto"));
var Transaction = /** @class */ (function () {
    function Transaction(payerPublicKey, payeePublicKey, amount, previousHash, payeeName, payerName) {
        this.payerName = '';
        this.payeeName = '';
        this.timestamp = Date.now();
        this.data = new TransactionData(payerPublicKey, payeePublicKey, amount, previousHash);
        if (payeeName) {
            this.payeeName = payeeName;
        }
        if (payerName) {
            this.payerName = payerName;
        }
    }
    Transaction.prototype.verify = function () {
        var balance = this.calculateBalance().balance;
        if (this.data.previousHash === "genesis") {
            console.log("🧬 GENESIS 🧬");
            return true;
        }
        if (balance < this.data.amount) {
            console.warn("Tried to spend " + this.data.amount + " with only " + balance);
            return false;
        }
        var verify = crypto_1.default.createVerify('SHA256');
        verify.update(this.data.toString());
        var result = verify.verify(this.data.payerPublicKey, this.signature);
        return result;
    };
    Transaction.prototype.calculateBalance = function () {
        var _this = this;
        var transactionsMade = fakeP2P_1.default.getTransactionsBySenderBeforeThisOne(this.data.payerPublicKey, this.timestamp);
        var transactionsReceived = fakeP2P_1.default.getTransactionsByReceiverBeforeThisOne(this.data.payerPublicKey, this.timestamp);
        var transactionsMadeIgnoringThis = transactionsMade.filter(function (transaction) { return transaction.data.previousHash !== _this.data.previousHash; });
        var amountSpent = 0;
        var amountReceived = 0;
        for (var _i = 0, transactionsMadeIgnoringThis_1 = transactionsMadeIgnoringThis; _i < transactionsMadeIgnoringThis_1.length; _i++) {
            var transaction = transactionsMadeIgnoringThis_1[_i];
            amountSpent += transaction.data.amount;
        }
        for (var _a = 0, transactionsReceived_1 = transactionsReceived; _a < transactionsReceived_1.length; _a++) {
            var transaction = transactionsReceived_1[_a];
            amountReceived += transaction.data.amount;
        }
        var balance = amountReceived - amountSpent;
        return { balance: balance, amountReceived: amountReceived, amountSpent: amountSpent };
    };
    Transaction.prototype.log = function () {
        console.log("\uD83D\uDCB8Transaction from " + this.payerName + " to " + this.payeeName + " with amount of " + this.data.amount);
    };
    return Transaction;
}());
exports.default = Transaction;
var TransactionData = /** @class */ (function () {
    function TransactionData(payerPublicKey, payeePublicKey, amount, previousHash) {
        this.payerPublicKey = payerPublicKey;
        this.payeePublicKey = payeePublicKey;
        this.amount = amount;
        this.previousHash = previousHash;
        var hash = this.createHash("MD5");
        hash.update(utilities_1.default.toString(this).toString()).end();
        this.hash = hash.digest("hex");
    }
    TransactionData.prototype.createHash = function (algorithm) {
        return crypto_1.default.createHash(algorithm);
    };
    return TransactionData;
}());
exports.TransactionData = TransactionData;
