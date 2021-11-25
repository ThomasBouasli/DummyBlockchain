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
    function Transaction(payerPublicKey, payeePublicKey, amount, previousHash) {
        this.data = new TransactionData(payerPublicKey, payeePublicKey, amount, previousHash);
    }
    Object.defineProperty(Transaction.prototype, "sign", {
        set: function (signature) {
            this.signature = signature;
        },
        enumerable: false,
        configurable: true
    });
    Transaction.prototype.verify = function () {
        console.log('-----------TRANSACTION VERIFICATION-----------');
        var _a = this.calculateBalance(), amountReceived = _a.amountReceived, amountSpent = _a.amountSpent;
        if (this.data.previousHash === "genesis") {
            console.log("genesis");
            return true;
        }
        if (amountReceived - amountSpent < this.data.amount) {
            console.log("Insufficient funds");
            return false;
        }
        var verify = crypto_1.default.createVerify('SHA256');
        verify.update(this.data.toString());
        var result = verify.verify(this.data.payerPublicKey, this.signature);
        result ? console.log("Transaction verified") : console.log("Transaction not verified");
        console.log('-----------END-----------');
        return result;
    };
    Transaction.prototype.calculateBalance = function () {
        var transactionsMade = fakeP2P_1.default.getTransactionsBySender(this.data.payerPublicKey);
        var transactionsReceived = fakeP2P_1.default.getTransactionsByReceiver(this.data.payerPublicKey);
        var amountSpent = 0;
        var amountReceived = 0;
        for (var _i = 0, transactionsMade_1 = transactionsMade; _i < transactionsMade_1.length; _i++) {
            var transaction = transactionsMade_1[_i];
            amountSpent += transaction.data.amount;
        }
        for (var _a = 0, transactionsReceived_1 = transactionsReceived; _a < transactionsReceived_1.length; _a++) {
            var transaction = transactionsReceived_1[_a];
            amountReceived += transaction.data.amount;
        }
        return { amountReceived: amountReceived, amountSpent: amountSpent };
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
        var hash = utilities_1.default.createHash("MD5");
        hash.update(utilities_1.default.toString(this).toString()).end();
        this.hash = hash.digest("hex");
    }
    return TransactionData;
}());
exports.TransactionData = TransactionData;
