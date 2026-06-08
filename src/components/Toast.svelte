<script lang="ts">
  import { toastStore, type Toast } from '$stores/toast';
  import { X } from 'lucide-svelte';

  let toasts: Toast[] = [];

  toastStore.subscribe((value) => {
    toasts = value;
  });

  function close(id: string) {
    toastStore.remove(id);
  }
</script>

<div class="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
  {#each toasts as toast (toast.id)}
    <div
      class="pointer-events-auto p-4 rounded-lg shadow-lg flex gap-3 items-center max-w-sm animate-slide-in"
      class:bg-green-900={toast.type === 'success'}
      class:bg-red-900={toast.type === 'error'}
      class:bg-blue-900={toast.type === 'info'}
      class:bg-yellow-900={toast.type === 'warning'}
      class:text-green-100={toast.type === 'success'}
      class:text-red-100={toast.type === 'error'}
      class:text-blue-100={toast.type === 'info'}
      class:text-yellow-100={toast.type === 'warning'}
    >
      <span class="flex-1">{toast.message}</span>
      <button 
        on:click={() => close(toast.id)}
        class="hover:opacity-70 transition"
      >
        <X size={18} />
      </button>
    </div>
  {/each}
</div>
