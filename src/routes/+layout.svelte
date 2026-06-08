<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { authStore } from '$stores/auth';
  import Toast from '$components/Toast.svelte';

  // Set auth state from server
  $: if ($page.data.user) {
    authStore.setUser($page.data.user);
  }
</script>

<svelte:head>
  <title>Caffeine Clock - Track Your Caffeine Intake</title>
  <meta name="description" content="Professional caffeine intake tracker with sleep analysis" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<Toast />

<div class="min-h-screen flex flex-col">
  <slot />
</div>
