export function useAppFeatures() {
  const config = useRuntimeConfig()

  // The nuxt-auth-utils module exposes a public 'auth' object with provider details.
  // The presence of a client ID is the indicator that the provider is enabled.
  const isGitHubLoginEnabled = !!config.public.auth?.github?.clientId
  const isGoogleLoginEnabled = !!config.public.auth?.google?.clientId

  // The 'forgot-password' feature is enabled if email sending is configured.
  // nuxt-auth-utils adds an 'email' provider to public auth config.
  const isPasswordResetEnabled = !!config.public.auth?.email?.enabled

  return {
    isGitHubLoginEnabled,
    isGoogleLoginEnabled,
    isPasswordResetEnabled,
  }
}
