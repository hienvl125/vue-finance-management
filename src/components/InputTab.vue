<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { Session } from "@supabase/supabase-js"
import { TransactionType, type Category } from "./../types"
import { fetchCategories } from "./../supabase/queries"
import { insertTransaction } from "./../supabase/mutations"
import { stringToCurrencyFormat, stringToNumeric } from "./../utils"
import VueDatePicker from "@vuepic/vue-datepicker"

// Constants
const transactionTypes: Record<TransactionType, string> = {
  [TransactionType.Expense]: "Expense",
  [TransactionType.Income]: "Income",
}

// Props
const props = defineProps<{
  session: Session
}>()

// Refs
const activeTransactionType = ref<TransactionType>(TransactionType.Expense)
const note = ref<string>("")
const amount = ref<HTMLInputElement | null>(null)
const categories = ref<Category[]>([])
const activeCategoryId = ref<number>(0)
const date = ref(null)
const toastMessage = ref<{
  toastType: "success" | "error",
  toastContent: string
} | null>(null)
const loadingCategories = ref<boolean>(true)

// Hooks
onMounted(async () => {
  try {
    const { data, error } = await fetchCategories(props.session.user?.id, activeTransactionType.value)
    if (error) {
      throw error
    }

    if (data.length > 0) {
      categories.value = data
      activeCategoryId.value = data[0].id
    }
  } finally {
    loadingCategories.value = false
  }
})

// Methods
async function onSubmit() {
  if(amount.value?.value && activeCategoryId.value && date.value) {
    const { error } = await insertTransaction({
      userId: props.session.user?.id,
      note: note.value || null,
      amount: stringToNumeric(amount.value.value),
      categoryId: activeCategoryId.value,
      transactionType: activeTransactionType.value,
      createdAt: date.value,
    })

    if (error) {
      setToastMessage("error", "Failed to submit your amount")
      throw error
    }
    
    resetForm()
    setToastMessage("success", "Successfully submitted your amount.")
  }
}

async function onClickTransactionType(transactionType: TransactionType) {
  activeTransactionType.value = transactionType
  const { data, error } = await fetchCategories(props.session.user?.id, activeTransactionType.value)
  if (error) {
    throw error
  }

  if (data.length > 0) {
    categories.value = data
    activeCategoryId.value = data[0].id
  }
}

function onClickCategory(categoryId: number) {
  activeCategoryId.value = categoryId
}

function onBlurAmount(event: FocusEvent) {
  const target = event.target as HTMLInputElement
  target.value = stringToCurrencyFormat(target.value)
}

function onKeyDownAmount(event: KeyboardEvent) {
  if (
    !(
      (event.key >= '0' && event.key <= '9') ||
      event.key === ',' ||
      event.key === '.' ||
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    )
  ) {
    event.preventDefault()
  }
}

function resetForm() {
  note.value = ""
  amount.value!.value = ""
  date.value = null
}

function setToastMessage(toastType: "success" | "error", toastContent: string) {
  toastMessage.value = {
    toastType,
    toastContent
  }
  setTimeout(() => {
    toastMessage.value = null
  }, 5000)
}

</script>

<template>
  <div v-if="toastMessage" class="toast toast-top toast-center">
    <div class="alert" :class="{'alert-success': toastMessage.toastType == 'success', 'alert-error': toastMessage.toastType == 'error' }">
      <span>{{ toastMessage.toastContent }}</span>
    </div>
  </div>
  <div role="tablist" class="tabs tabs-bordered mb-3">
    <a
      v-for="(transactionTypeString, transactionType) in transactionTypes"
      role="tab"
      class="tab capitalize"
      :class="{ 'tab-active': transactionType == activeTransactionType }"
      @click.prevent="onClickTransactionType(transactionType)"
    >{{ transactionTypeString }}</a>
  </div>
  <form @submit.prevent="onSubmit" class="space-y-3">
    <div class="space-y-2">
      <label for="note" class="font-bold text-lg">Note</label>
      <label class="input input-bordered input-primary flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 opacity-70">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
        <input v-model="note" id="note" name="note" type="text" class="grow" placeholder="Note..." />
      </label>
    </div>

    <div class="space-y-2">
      <label for="date" class="font-bold text-lg">Date<span class="font-light text-red-500">*</span></label>
      <VueDatePicker id="date" class="daisy-dp daisy-dp-primary" v-model="date" required />
    </div>

    <div class="space-y-2">
      <label for="amount" class="font-bold text-lg">Amount<span class="font-light text-red-500">*</span></label>
      <label class="input input-bordered input-primary flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 opacity-70">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <input ref="amount" @keydown="onKeyDownAmount" @blur="onBlurAmount" id="amount" name="amount" type="text" class="grow" placeholder="Amount..." required />
      </label>
    </div>

    <div class="space-y-2">
      <label for="category" class="font-bold text-lg">Category<span class="font-light text-red-500">*</span></label>
      <div v-if="!loadingCategories && categories" class="grid grid-cols-4 gap-4">
        <div
          :key="category.id"
          v-for="category in categories"
          class="h-20 flex text-center items-center justify-center w-full rounded-lg border hover:border-primary hover:text-primary cursor-pointer"
          :class="{ 'bg-primary text-primary-content border-primary hover:text-primary-content': category.id === activeCategoryId }"
          @click="onClickCategory(category.id)"
        >
          {{ category.name }}
        </div>
      </div>
      <div v-else class="flex justify-center">
        <span class="loading loading-spinner text-primary"></span>
      </div>
    </div>

    <button type="submit" class="btn btn-primary w-full">Submit</button>
  </form>
</template>
