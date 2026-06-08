<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$stores/auth';

  async function logout() {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      authStore.logout();
      await goto('/auth/login');
    }
  }
</script>

{#if $authStore.isAuthenticated && $authStore.user}
  <nav class="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <a href="/dashboard" class="text-2xl font-bold text-primary-400">☕ Caffeine Clock</a>
      
      <div class="flex items-center gap-4">
        <a href="/profile" class="text-dark-300 hover:text-primary-400 transition">
          {$authStore.user.username}
        </a>
        <img 
          src={$authStore.user.profileImage} 
          alt={$authStore.user.displayName}
          class="w-8 h-8 rounded-full border-2 border-primary-500"
        />
        <button 
          on:click={logout}
          class="btn-secondary text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
{/if}
