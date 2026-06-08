<script lang="ts">
  import Card from '$components/Card.svelte';
  import TextInput from '$components/TextInput.svelte';
  import { toastStore } from '$stores/toast';
  import { AlertCircle, Mail } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let email = '';
  let isLoading = false;
  let error = '';
  let isSuccess = false;

  async function handleResend() {
    if (!email) {
      error = 'Please enter your email address';
      return;
    }

    error = '';
    isLoading = true;

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        isSuccess = true;
        toastStore.success('Verification email sent!');
        setTimeout(() => goto(`/auth/check-email?email=${encodeURIComponent(email)}`), 1500);
      } else {
        error = data.error || 'Failed to resend verification email';
        toastStore.error(error);
      }
    } catch (err) {
      error = 'An error occurred';
      toastStore.error(error);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <Card>
      <div class="text-center mb-6">
        <Mail class="mx-auto text-primary-400 mb-4" size={48} />
        <h2 class="text-2xl font-bold text-white">Resend Verification</h2>
        <p class="text-dark-300 text-sm mt-2">Enter your email to receive a new verification link</p>
      </div>

      {#if error}
        <div class="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg flex gap-3">
          <AlertCircle class="text-red-400 flex-shrink-0" size={20} />
          <p class="text-red-200 text-sm">{error}</p>
        </div>
      {/if}

      {#if isSuccess}
        <div class="text-center py-4 text-green-400">
          <p class="mb-4">Verification email has been sent!</p>
          <p class="text-dark-300 text-sm">Redirecting...</p>
        </div>
      {:else}
        <form on:submit|preventDefault={handleResend} class="space-y-4">
          <TextInput
            label="Email Address"
            type="email"
            bind:value={email}
            placeholder="you@example.com"
            disabled={isLoading}
          />

          <button
            type="submit"
            class="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Verification Email'}
          </button>
        </form>

        <div class="mt-4 text-center text-sm text-dark-400">
          <a href="/auth/login" class="text-primary-400 hover:text-primary-300">
            Back to Login
          </a>
        </div>
      {/if}
    </Card>
  </div>
</div>
