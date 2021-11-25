import * as Crypto from "crypto";
import Transaction, { TransactionData } from "./transaction";

export default abstract class Utils {

  public static createNewKeyPair(): Array<string> {
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


  public static toString(data : any) : string {
    return JSON.stringify(data);
  }

  public static createHash(algorithm : string) : Crypto.Hash {
    return Crypto.createHash(algorithm)
  }
}