<script lang="ts">
  import { Eye, EyeOff } from 'lucide-svelte';
  import { writable } from 'svelte/store';

  export let label: string = '';
  export let placeholder: string = '';
  export let value: string = '';
  export let error: string = '';
  export let disabled: boolean = false;
  export let hint: string = '';

  const showPassword = writable(false);
</script>

<div class="w-full">
  {#if label}
    <label class="block text-sm font-semibold text-dark-200 mb-2">{label}</label>
  {/if}
  <div class="relative">
    <input
      type={$showPassword ? 'text' : 'password'}
      bind:value
      {placeholder}
      {disabled}
      class="input-field pr-10"
      class:border-red-500={error}
      class:focus:border-red-500={error}
    />
    <button
      type="button"
      on:click={() => showPassword.update((v) => !v)}
      class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition disabled:opacity-50"
      {disabled}
    >
      {#if $showPassword}
        <EyeOff size={18} />
      {:else}
        <Eye size={18} />
      {/if}
    </button>
  </div>
  {#if hint}
    <p class="text-xs text-dark-400 mt-1">{hint}</p>
  {/if}
  {#if error}
    <p class="text-xs text-red-400 mt-1">{error}</p>
  {/if}
</div>
