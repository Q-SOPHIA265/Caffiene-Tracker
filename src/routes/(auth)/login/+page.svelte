<script lang="ts">
  import { goto } from '$app/navigation';
  import { toastStore } from '$stores/toast';
  import { loginSchema, type LoginInput } from '$lib/validation';
  import Card from '$components/Card.svelte';
  import TextInput from '$components/TextInput.svelte';
  import PasswordInput from '$components/PasswordInput.svelte';
  import { AlertCircle } from 'lucide-svelte';

  let identifier = '';
  let password = '';
  let isLoading = false;
  let errors: Record<string, string> = {};
  let serverError = '';

  async function handleLogin() {
    errors = {};
    serverError = '';
    isLoading = true;

    try {
      const result = loginSchema.safeParse({ identifier, password });

      if (!result.success) {
        result.error.errors.forEach((err) => {
          const path = err.path[0] as string;
          errors[path] = err.message;
        });
        isLoading = false;
        return;
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data)
      });

      const data = await response.json();

      if (!response.ok) {
        serverError = data.error || 'Login failed';
        toastStore.error(serverError);
        isLoading = false;
        return;
      }

      toastStore.success('Login successful!');
      await goto('/dashboard');
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

    <!-- Login Card -->
    <Card>
      <h2 class="text-2xl font-bold text-white mb-6">Welcome Back</h2>

      {#if serverError}
        <div class="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg flex gap-3">
          <AlertCircle class="text-red-400 flex-shrink-0" size={20} />
          <p class="text-red-200 text-sm">{serverError}</p>
        </div>
      {/if}

      <form on:submit|preventDefault={handleLogin} class="space-y-4">
        <TextInput
          label="Email or Username"
          type="text"
          bind:value={identifier}
          placeholder="you@example.com or username"
          error={errors.identifier}
          disabled={isLoading}
        />

        <PasswordInput
          label="Password"
          bind:value={password}
          error={errors.password}
          disabled={isLoading}
        />

        <div class="flex justify-end">
          <a href="/auth/forgot-password" class="text-sm text-primary-400 hover:text-primary-300">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          class="btn-primary w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-dark-400">
        Don't have an account?
        <a href="/auth/register" class="text-primary-400 hover:text-primary-300 font-semibold">
          Register here
        </a>
      </div>
    </Card>
  </div>
</div>
