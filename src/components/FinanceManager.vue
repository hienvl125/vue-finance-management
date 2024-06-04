<script setup lang="ts">
import { ref, defineProps } from "vue"
import type { Session } from "@supabase/supabase-js"
import InputTab from "./InputTab.vue"
type Tab = "input" | "report" | "settings"

// Constants
const tabs: Tab[] = ["input", "report", "settings"]

// Props
const props = defineProps<{
  session: Session
}>()

// Refs
const activeTab = ref<Tab>("input")

function onClickTab(tab: Tab) {
  activeTab.value = tab
}

</script>
<template>
  <div class="flex flex-col h-full">
    <div role="tablist" class="tabs tabs-boxed tabs-lg my-5">
      <a
        role="tab"
        v-for="tab in tabs"
        :key="tab"
        class="tab capitalize"
        :class="{ 'tab-active': tab === activeTab }"
        @click.prevent="onClickTab(tab)"
      >
        {{ tab }}
      </a>
    </div>
    <main class="w-full h-full flex-1">
      <InputTab v-if="activeTab === 'input'" :session="session" />
      <h1 v-if="activeTab === 'report'">Report</h1>
      <h1 v-if="activeTab === 'settings'">Settings</h1>
    </main>
  </div>
</template>
