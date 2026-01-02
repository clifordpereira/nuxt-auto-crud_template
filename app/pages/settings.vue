<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useSeoMeta({
  title: "Settings",
  description: "View application settings",
});

const { isGitHubLoginEnabled, isGoogleLoginEnabled, isPasswordResetEnabled } = useAppFeatures();

const settings = [
  { name: "Google Social Login", enabled: isGoogleLoginEnabled },
  { name: "GitHub Social Login", enabled: isGitHubLoginEnabled },
  { name: "Forgot Password Link", enabled: isPasswordResetEnabled },
];
</script>

<template>
  <UPage>
    <UPageHeader
      title="Application Settings"
      description="This is a read-only view of the features configured for this application."
      icon="i-lucide-settings"
    />
    <UPageBody>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Authentication Features</h3>
        </template>
        <div class="space-y-4">
          <div
            v-for="setting in settings"
            :key="setting.name"
            class="flex items-center justify-between p-2 border rounded-md"
          >
            <span class="text-base font-medium">{{ setting.name }}</span>
            <UBadge
              :color="setting.enabled ? 'primary' : 'error'"
              variant="subtle"
              size="lg"
            >
              <span class="text-sm">{{
                setting.enabled ? "Enabled" : "Disabled"
              }}</span>
            </UBadge>
          </div>
        </div>
        <template #footer>
          <p class="text-sm text-gray-500">
            To enable or disable features, update the environment variables and
            restart the application.
          </p>
        </template>
      </UCard>
    </UPageBody>
  </UPage>
</template>
