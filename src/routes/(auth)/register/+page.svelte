<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { toastStore } from '$stores/toast';
  import { registerSchema, type RegisterInput } from '$lib/validation';
  import Card from '$components/Card.svelte';
  import Button from '$components/Button.svelte';
  import TextInput from '$components/TextInput.svelte';
  import PasswordInput from '$components/PasswordInput.svelte';
  import { AlertCircle } from 'lucide-svelte';

  let email = '';
  let username = '';
  let displayName = '';
  let password = '';
  let confirmPassword = '';
  let isLoading = false;
  let errors: Record<string, string> = {};
  let serverError = '';

  async function handleRegister() {
    // Reset errors
    errors = {};
    serverError = '';
    isLoading = true;

    try {
      // Validate input
      const result = registerSchema.safeParse({
        email,
        username,
        password,
        confirmPassword,
        displayName
      });

      if (!result.success) {
        result.error.errors.forEach((err) => {
          const path = err.path[0] as string;
          errors[path] = err.message;
        });
        isLoading = false;
        return;
      }

      // Send to server
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data)
      });

      const data = await response.json();

      if (!response.ok) {
        serverError = data.error || 'Registration failed';
        toastStore.error(serverError);
        isLoading = false;
        return;
      }

      toastStore.success('Registration successful! Check your email to verify.');
      await goto('/auth/check-email');
    } catch (error) {
      serverError = 'An unexpected error occurred';
      toastStore.error(serverError);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-primary-400 mb-2">☕ Caffeine Clock</h1>
      <p class="text-dark-300">Track your caffeine intake with precision</p>
    </div>

    <!-- Register Card -->
    <Card>
      <h2 class="text-2xl font-bold text-white mb-6">Create Account</h2>

      {#if serverError}
        <div class="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg flex gap-3">
          <AlertCircle class="text-red-400 flex-shrink-0" size={20} />
          <p class="text-red-200 text-sm">{serverError}</p>
        </div>
      {/if}

      <form on:submit|preventDefault={handleRegister} class="space-y-4">
        <TextInput
          label="Email Address"
          type="email"
          bind:value={email}
          placeholder="you@example.com"
          error={errors.email}
          disabled={isLoading}
        />

        <TextInput
          label="Username"
          type="text"
          bind:value={username}
          placeholder="username"
          error={errors.username}
          disabled={isLoading}
          hint="3-20 characters, letters, numbers, underscore, hyphen"
        />

        <TextInput
          label="Display Name"
          type="text"
          bind:value={displayName}
          placeholder="John Doe"
          error={errors.displayName}
          disabled={isLoading}
        />

        <PasswordInput
          label="Password"
          bind:value={password}
          error={errors.password}
          disabled={isLoading}
          hint="Min 8 chars: 1 uppercase, 1 lowercase, 1 number, 1 special character"
        />

        <PasswordInput
          label="Confirm Password"
          bind:value={confirmPassword}
          error={errors.confirmPassword}
          disabled={isLoading}
        />

        <button
          type="submit"
          class="btn-primary w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-dark-400">
        Already have an account?
        <a href="/auth/login" class="text-primary-400 hover:text-primary-300 font-semibold">
          Login here
        </a>
      </div>
    </Card>
  </div>
</div>
