<script setup lang="ts">
import { defineProps } from "vue"
import type { Session } from "@supabase/supabase-js"
import ThemeSwitcher from "./ThemeSwitcher.vue"
import LoginButtonWithModal from "./LoginButtonWithModal.vue"

const props = defineProps<{
  session: Session | null
  setAppAlert: (alertType: "success" | "error" | "info" | "warning", alertMessage: string) => void
}>()

</script>
<template>
  <div class="flex justify-between items-center">
    <p v-if="props.session" class="text-sm"><span class="font-bold">Welcome</span>, {{ props.session.user.email }}</p>
    <LoginButtonWithModal v-else :setAppAlert="props.setAppAlert" />
    <ThemeSwitcher />
  </div>
</template>
