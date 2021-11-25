"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
var utilities_1 = __importDefault(require("./utilities"));
var crypto_1 = __importDefault(require("crypto"));
var Block = /** @class */ (function () {
    function Block(previousHash) {
        this.transactions = [];
        this.hash = "";
        this.timestamp = Date.now();
        this.previousHash = previousHash;
        this.nonce = Math.random() * 1000000;
    }
    Block.prototype.CreateProofOfWork = function (nonce) {
        var solution = 1;
        console.log("⛏️  mining...");
        while (true) {
            var hash = this.createHash("MD5");
            hash.update((nonce + solution + utilities_1.default.toString(this)).toString()).end();
            var attempt = hash.digest("hex");
            if (attempt.substr(0, 4) === "0000") {
                console.log("\u26CF\uFE0F Solved: " + solution);
                this.hash = attempt;
                break;
            }
            solution += 1;
        }
    };
    Block.prototype.addTransaction = function (transaction) {
        if (this.transactions.length + 1 <= 10) {
            if (transaction.verify()) {
                this.transactions.push(transaction);
            }
        }
    };
    Block.prototype.createHash = function (algorithm) {
        return crypto_1.default.createHash(algorithm);
    };
    return Block;
}());
exports.Block = Block;
