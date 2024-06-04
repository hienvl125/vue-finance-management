import { supabase } from "."
import type { TransactionType } from "./../types"

export const fetchCategories = (userId: string, transactionType: TransactionType) => {
  return supabase
    .from("categories")
    .select("id,name")
    .eq("transaction_type", transactionType)
    .or(`user_id.eq.${userId},user_id.is.null`)
}
