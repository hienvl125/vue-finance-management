<script setup lang="ts">
  import { ref, defineProps } from "vue"
  import { supabase } from "./../supabase"

  const props = defineProps<{
    setAppAlert: (alertType: "success" | "error" | "info" | "warning", alertMessage: string) => void
  }>()

  const emailInput = ref<HTMLInputElement | null>(null)
  const closeLoginModal = ref<HTMLButtonElement | null>(null)
  const submitLoginError = ref<string>("")
  const loading = ref<boolean>(false)

  async function submitLogin() {
    if(emailInput.value?.value) {
      loading.value = true
      submitLoginError.value = ""
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: emailInput.value.value,
        })

        if (error) {
          submitLoginError.value = "Login failed, please try again"
          throw error
        }

        props.setAppAlert("success", "Sent OTP to your email, please check your inbox")
        closeLoginModal.value?.click()
      } catch(error) {
        submitLoginError.value = "Login failed, please try again"
        throw error
      } finally {
        loading.value = false
      }
    }
  }
</script>
<template>
  <button class="btn btn-primary" onclick="loginModal.showModal()">Login</button>
  <dialog id="loginModal" class="modal">
    <div class="modal-box space-y-2">
      <h3 class="font-bold text-3xl text-center">Login now</h3>
      <p class="text-sm text-center">Login or create an account with your email</p>
      <div v-if="loading" class="w-full text-center" >
        <span class="loading loading-spinner text-primary"></span>
      </div>
      <form v-else @submit.prevent="submitLogin" class="space-y-2">
        <div v-if="submitLoginError" role="alert" class="alert alert-error rounded-lg py-2 px-3">
          <span class="text-sm">{{ submitLoginError }}</span>
        </div>
        <label class="input input-bordered input-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
          <input name="email" ref="emailInput" type="email" class="grow" placeholder="Email" required />
        </label>
        <button type="submit" class="btn btn-primary btn-sm w-full">Submit</button>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button ref="closeLoginModal">close</button>
    </form>
  </dialog>
</template>
