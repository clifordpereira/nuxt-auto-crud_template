<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useSeoMeta({
  title: "Settings",
  description: "View application settings",
});

const {
  data: status,
  pending,
  refresh,
} = await useFetch("/api/settings-status", {
  key: "admin-env-check",
  cache: "no-cache",
});

const getStatus = (isConfigured: boolean) => {
  return isConfigured
    ? { color: "primary" as const, text: "Enabled" }
    : { color: "error" as const, text: "Missing" };
};

const getAdminStatus = (isChanged: boolean) => {
  return isChanged
    ? { color: "primary" as const, text: "Secure" }
    : { color: "warning" as const, text: "Default Value" };
};

const getSessionStatus = (isValid: boolean, hasValue: boolean) => {
  if (!hasValue) return { color: "error" as const, text: "Missing" };
  return isValid
    ? { color: "primary" as const, text: "Secure" }
    : { color: "warning" as const, text: "Too Short (< 32 chars)" };
};
</script>

<template>
  <div class="min-h-screen overflow-y-auto bg-gray-50/50 font-sans">
    <UContainer class="py-12 pb-24">
      <UCard :ui="{ body: { padding: 'p-6' } }">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold">System Environment Status</h1>
              <p class="text-sm text-gray-500 font-medium">
                Validating runtime configurations from <code>.env</code>
              </p>
            </div>
            <UButton
              icon="i-heroicons-arrow-path"
              color="primary"
              variant="soft"
              :loading="pending"
              @click="refresh"
            >
              Refresh Status
            </UButton>
          </div>
        </template>

        <div v-if="status" class="space-y-10">
          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2
                class="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"
              >
                <UIcon name="i-heroicons-shield-check" class="w-4 h-4" /> Core
                Security & Admin
              </h2>
              <UBadge color="error" variant="soft" size="xs" class="font-bold"
                >REQUIRED</UBadge
              >
            </div>

            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:border-primary-200 transition-colors"
              >
                <div class="flex flex-col">
                  <UKbd size="md">NUXT_SESSION_PASSWORD</UKbd>
                  <span class="text-xs text-gray-500 mt-1 font-medium"
                    >Used for session encryption</span
                  >
                </div>
                <UBadge
                  :color="
                    getSessionStatus(
                      status.isSessionPasswordValid,
                      status.hasSessionPassword,
                    ).color
                  "
                  variant="solid"
                >
                  {{
                    getSessionStatus(
                      status.isSessionPasswordValid,
                      status.hasSessionPassword,
                    ).text
                  }}
                </UBadge>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  class="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:border-primary-200 transition-colors"
                >
                  <div class="flex flex-col">
                    <UKbd size="md">NUXT_ADMIN_EMAIL</UKbd>
                    <span class="text-xs text-gray-400 mt-1 italic font-medium"
                      >admin@example.com</span
                    >
                  </div>
                  <UBadge
                    :color="getAdminStatus(status.isAdminEmailChanged).color"
                    variant="solid"
                  >
                    {{
                      status.isAdminEmailChanged ? "Secure" : "Default Value"
                    }}
                  </UBadge>
                </div>
                <div
                  class="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:border-primary-200 transition-colors"
                >
                  <div class="flex flex-col">
                    <UKbd size="md">NUXT_ADMIN_PASSWORD</UKbd>
                    <span class="text-xs text-gray-400 mt-1 italic font-medium"
                      >$1Password</span
                    >
                  </div>
                  <UBadge
                    :color="getAdminStatus(status.isAdminPasswordChanged).color"
                    variant="solid"
                  >
                    {{
                      status.isAdminPasswordChanged ? "Secure" : "Default Value"
                    }}
                  </UBadge>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2
                class="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"
              >
                <UIcon name="i-heroicons-user-group" class="w-4 h-4" /> Social
                Authentication
              </h2>
              <UBadge
                color="info"
                variant="soft"
                size="xs"
                class="font-bold uppercase"
                >Optional</UBadge
              >
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UCard
                :ui="{ body: { padding: 'p-4' } }"
                class="shadow-sm border hover:border-primary-200 transition-colors"
              >
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold flex items-center gap-2 text-sm"
                    ><UIcon name="i-simple-icons-github" /> GitHub</span
                  >
                  <UBadge
                    :color="
                      getStatus(
                        status.hasGithubClientId &&
                          status.hasGithubClientSecret,
                      ).color
                    "
                    variant="solid"
                  >
                    {{ status.hasGithubClientId ? "Enabled" : "Missing" }}
                  </UBadge>
                </div>
                <div class="space-y-2">
                  <div
                    class="flex justify-between items-center text-xs text-gray-400 font-mono"
                  >
                    ID: <UKbd size="xs">NUXT_OAUTH_GITHUB_CLIENT_ID</UKbd>
                  </div>
                  <div
                    class="flex justify-between items-center text-xs text-gray-400 font-mono"
                  >
                    Secret:
                    <UKbd size="xs">NUXT_OAUTH_GITHUB_CLIENT_SECRET</UKbd>
                  </div>
                </div>
              </UCard>
              <UCard
                :ui="{ body: { padding: 'p-4' } }"
                class="shadow-sm border hover:border-primary-200 transition-colors"
              >
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold flex items-center gap-2 text-sm"
                    ><UIcon name="i-simple-icons-google" /> Google</span
                  >
                  <UBadge
                    :color="
                      getStatus(
                        status.hasGoogleClientId &&
                          status.hasGoogleClientSecret,
                      ).color
                    "
                    variant="solid"
                  >
                    {{ status.hasGoogleClientId ? "Enabled" : "Missing" }}
                  </UBadge>
                </div>
                <div class="space-y-2">
                  <div
                    class="flex justify-between items-center text-xs text-gray-400 font-mono"
                  >
                    ID: <UKbd size="xs">NUXT_OAUTH_GOOGLE_CLIENT_ID</UKbd>
                  </div>
                  <div
                    class="flex justify-between items-center text-xs text-gray-400 font-mono"
                  >
                    Secret:
                    <UKbd size="xs">NUXT_OAUTH_GOOGLE_CLIENT_SECRET</UKbd>
                  </div>
                </div>
              </UCard>
            </div>
          </section>

          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2
                class="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"
              >
                <UIcon name="i-heroicons-envelope" class="w-4 h-4" /> Mail
                Services
              </h2>
              <UBadge
                color="info"
                variant="soft"
                size="xs"
                class="font-bold uppercase"
                >Optional</UBadge
              >
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                class="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:border-primary-200 transition-colors"
              >
                <div class="flex flex-col">
                  <UKbd size="md">NUXT_EMAIL_FROM</UKbd>
                  <span class="text-xs text-gray-500 mt-1 italic font-medium"
                    >Sender address</span
                  >
                </div>
                <UBadge
                  :color="getStatus(status.hasEmailFrom).color"
                  variant="solid"
                >
                  {{ status.hasEmailFrom ? "Enabled" : "Missing" }}
                </UBadge>
              </div>
              <div
                class="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:border-primary-200 transition-colors"
              >
                <div class="flex flex-col">
                  <UKbd size="md">NUXT_RESEND_API_KEY</UKbd>
                  <span class="text-xs text-gray-500 mt-1 italic font-medium"
                    >API integration key</span
                  >
                </div>
                <UBadge
                  :color="getStatus(status.hasResendApiKey).color"
                  variant="solid"
                >
                  {{ status.hasResendApiKey ? "Enabled" : "Missing" }}
                </UBadge>
              </div>
            </div>
          </section>

          <section>
            <div class="flex items-center gap-3 mb-4">
              <h2
                class="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"
              >
                <UIcon
                  name="i-heroicons-presentation-chart-line"
                  class="w-4 h-4"
                />
                Marketing & Tracking
              </h2>
              <UBadge
                color="info"
                variant="soft"
                size="xs"
                class="font-bold uppercase"
                >Optional</UBadge
              >
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                class="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:border-primary-200 transition-colors"
              >
                <div class="flex flex-col">
                  <UKbd size="md">NUXT_PUBLIC_SCRIPTS_GOOGLE_ANALYTICS_ID</UKbd>
                  <span class="text-xs text-gray-500 mt-1 italic font-medium"
                    >Google Analytics (G4)</span
                  >
                </div>
                <UBadge
                  :color="getStatus(status.hasGoogleAnalyticsId).color"
                  variant="solid"
                >
                  {{ status.hasGoogleAnalyticsId ? "Enabled" : "Missing" }}
                </UBadge>
              </div>
              <div
                class="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:border-primary-200 transition-colors"
              >
                <div class="flex flex-col">
                  <UKbd size="md"
                    >NUXT_PUBLIC_SCRIPTS_GOOGLE_TAG_MANAGER_ID</UKbd
                  >
                  <span class="text-xs text-gray-500 mt-1 italic font-medium"
                    >Google Ads (GTM)</span
                  >
                </div>
                <UBadge
                  :color="getStatus(status.hasGoogleTagManagerId).color"
                  variant="solid"
                >
                  {{ status.hasGoogleTagManagerId ? "Enabled" : "Missing" }}
                </UBadge>
              </div>
            </div>
          </section>
        </div>

        <div v-else class="space-y-8">
          <USkeleton class="h-24 w-full" v-for="i in 4" :key="i" />
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
