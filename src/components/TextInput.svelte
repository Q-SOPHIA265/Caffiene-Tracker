<script lang="ts">
  export let label: string = '';
  export let type: string = 'text';
  export let placeholder: string = '';
  export let value: string = '';
  export let error: string = '';
  export let disabled: boolean = false;
  export let hint: string = '';
</script>

<div class="w-full">
  {#if label}
    <label class="block text-sm font-semibold text-dark-200 mb-2">{label}</label>
  {/if}
  <input
    {type}
    bind:value
    {placeholder}
    {disabled}
    class="input-field"
    class:border-red-500={error}
    class:focus:border-red-500={error}
  />
  {#if hint}
    <p class="text-xs text-dark-400 mt-1">{hint}</p>
  {/if}
  {#if error}
    <p class="text-xs text-red-400 mt-1">{error}</p>
  {/if}
</div>
