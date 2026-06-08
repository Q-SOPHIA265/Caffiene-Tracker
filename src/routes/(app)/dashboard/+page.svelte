<script lang="ts">
  import { authStore } from '$stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Card from '$components/Card.svelte';
  import { Users, Coffee, BarChart3, Settings } from 'lucide-svelte';

  let isAdmin = false;

  onMount(() => {
    if (!$authStore.isAuthenticated) {
      goto('/auth/login');
    }
    isAdmin = $authStore.user?.role === 'admin';
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800">
  <!-- Header -->
  <div class="bg-dark-800 border-b border-dark-700 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-4xl font-bold text-primary-400">☕ Welcome, {$authStore.user?.displayName}!</h1>
      <p class="text-dark-300 mt-2">Track your caffeine intake and optimize your sleep</p>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 py-12">
    {#if isAdmin}
      <!-- Admin Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Total Users</p>
              <p class="text-3xl font-bold text-primary-400 mt-2">--</p>
            </div>
            <Users class="text-primary-500 opacity-20" size={48} />
          </div>
        </Card>
        <Card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Caffeine Logs</p>
              <p class="text-3xl font-bold text-primary-400 mt-2">--</p>
            </div>
            <Coffee class="text-primary-500 opacity-20" size={48} />
          </div>
        </Card>
        <Card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Avg Intake</p>
              <p class="text-3xl font-bold text-primary-400 mt-2">-- mg</p>
            </div>
            <BarChart3 class="text-primary-500 opacity-20" size={48} />
          </div>
        </Card>
        <Card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Settings</p>
              <p class="text-3xl font-bold text-primary-400 mt-2">⚙️</p>
            </div>
            <Settings class="text-primary-500 opacity-20" size={48} />
          </div>
        </Card>
      </div>
    {/if}

    <!-- User Quick Stats -->
    <Card class="mb-8">
      <h2 class="text-2xl font-bold text-white mb-6">Your Stats</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p class="text-dark-400 text-sm">Body Weight</p>
          <p class="text-2xl font-bold text-primary-400 mt-2">{$authStore.user?.bodyWeight} kg</p>
        </div>
        <div>
          <p class="text-dark-400 text-sm">Age</p>
          <p class="text-2xl font-bold text-primary-400 mt-2">{$authStore.user?.age || 'Not set'}</p>
        </div>
        <div>
          <p class="text-dark-400 text-sm">Member Since</p>
          <p class="text-2xl font-bold text-primary-400 mt-2">
            {new Date($authStore.user?.createdAt || '').toLocaleDateString()}
          </p>
        </div>
      </div>
    </Card>

    <!-- Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card class="card-hover" on:click={() => goto('/caffeine/log')}>
        <h3 class="text-xl font-bold text-primary-400 mb-2">☕ Log Caffeine</h3>
        <p class="text-dark-300">Track your caffeine consumption and get personalized sleep recommendations</p>
      </Card>
      <Card class="card-hover" on:click={() => goto('/profile')}>
        <h3 class="text-xl font-bold text-primary-400 mb-2">👤 My Profile</h3>
        <p class="text-dark-300">View and update your profile information and preferences</p>
      </Card>
    </div>
  </div>
</div>
