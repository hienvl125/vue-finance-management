<script setup lang="ts">
import { ref, onMounted } from "vue"
import { supabase } from "./supabase"
import type { Session } from "@supabase/supabase-js"
import Header from "./components/Header.vue"
import FinanceManager from "./components/FinanceManager.vue"

const session = ref<Session | null>(null)
const alert = ref<{
  alertType: "success" | "error" | "info" | "warning"
  alertMessage: string
} | null>(null)

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})

function setAppAlert(alertType: "success" | "error" | "info" | "warning", alertMessage: string) {
  alert.value = {
    alertType,
    alertMessage
  }
}

</script>
<template>
  <main class="mx-auto w-full max-w-screen-sm mt-10 border rounded-lg p-5">
    <Header :session="session" :setAppAlert="setAppAlert" />
    <div v-if="alert" class="my-2">
      <div role="alert" :class="`alert alert-${alert.alertType} rounded-lg py-2 px-3`">
        <span class="text-sm">{{ alert.alertMessage }}</span>
      </div>
    </div>
    <div class="h-[calc(100vh-180px)]">
      <FinanceManager v-if="session" />
      <div v-else class="w-full h-full flex justify-center items-center">
        <p class="text-3xl font-semibold">Login to track your finance now!</p>
      </div>
    </div>
  </main>
</template>
