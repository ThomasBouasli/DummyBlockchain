import Transaction, { TransactionData } from "./transaction";

export default abstract class Utils {
  
  public static toString(data : any) : string {
    return JSON.stringify(data);
  }
}