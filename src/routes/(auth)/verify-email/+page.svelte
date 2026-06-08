<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { toastStore } from '$stores/toast';
  import { verifyEmailSchema } from '$lib/validation';
  import Card from '$components/Card.svelte';
  import { AlertCircle, CheckCircle } from 'lucide-svelte';

  let isVerifying = true;
  let isSuccess = false;
  let error = '';
  let displayEmail = '';

  onMount(async () => {
    const token = $page.url.searchParams.get('token');

    if (!token) {
      error = 'Verification token not found';
      isVerifying = false;
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();
      displayEmail = data.email || '';

      if (response.ok) {
        isSuccess = true;
        toastStore.success('Email verified successfully!');
        setTimeout(() => goto('/auth/login'), 2000);
      } else {
        error = data.error || 'Verification failed';
        toastStore.error(error);
      }
    } catch (err) {
      error = 'An error occurred during verification';
      toastStore.error(error);
    } finally {
      isVerifying = false;
    }
  });

  import { onMount } from 'svelte';
</script>

<div class="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <Card>
      {#if isVerifying}
        <div class="text-center py-8">
          <div class="inline-block animate-spin">
            <div class="w-12 h-12 border-4 border-primary-400/30 border-t-primary-400 rounded-full" />
          </div>
          <p class="mt-4 text-dark-200">Verifying your email...</p>
        </div>
      {:else if isSuccess}
        <div class="text-center py-8">
          <CheckCircle class="mx-auto text-green-400 mb-4" size={48} />
          <h2 class="text-2xl font-bold text-green-400 mb-2">Email Verified!</h2>
          <p class="text-dark-300 mb-4">Thank you for verifying your email.</p>
          <p class="text-dark-400 text-sm">Redirecting to login...</p>
        </div>
      {:else}
        <div class="text-center py-8">
          <AlertCircle class="mx-auto text-red-400 mb-4" size={48} />
          <h2 class="text-2xl font-bold text-red-400 mb-2">Verification Failed</h2>
          <p class="text-dark-300 mb-4">{error}</p>
          <div class="space-y-2">
            <a href="/auth/login" class="btn-primary block w-full text-center">
              Back to Login
            </a>
            <a href="/auth/resend-verification" class="btn-secondary block w-full text-center">
              Resend Verification Email
            </a>
          </div>
        </div>
      {/if}
    </Card>
  </div>
</div>
