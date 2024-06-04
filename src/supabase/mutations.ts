import { supabase } from "."
import type { TransactionType } from "../types"

export const insertTransaction = ({
  userId,
  note,
  amount,
  transactionType,
  categoryId,
  createdAt,
}: {
  userId: string,
  note: string | null,
  amount: number,
  transactionType: TransactionType,
  categoryId: number,
  createdAt: Date,
}) => {
  return supabase
    .from('transactions')
    .insert({
      note,
      amount,
      transaction_type: transactionType,
      category_id: categoryId,
      user_id: userId,
      created_at: createdAt,
    })
} 
