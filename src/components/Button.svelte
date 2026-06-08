<script lang="ts">
  export let href: string = '';
  export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let isLoading: boolean = false;
  export let fullWidth: boolean = false;
  export let class: string = '';
</script>

{#if href}
  <a
    {href}
    class="inline-flex items-center justify-center font-semibold rounded-lg transition-colors"
    class:btn-primary={variant === 'primary'}
    class:btn-secondary={variant === 'secondary'}
    class:btn-danger={variant === 'danger'}
    class:px-3={size === 'sm'}
    class:py-2={size === 'sm'}
    class:px-4={size === 'md'}
    class:py-2={size === 'md'}
    class:px-6={size === 'lg'}
    class:py-3={size === 'lg'}
    class:w-full={fullWidth}
    class:opacity-50={disabled}
    class:cursor-not-allowed={disabled}
    class:text-sm={size === 'sm'}
    class:text-base={size === 'md'}
    class:text-lg={size === 'lg'}
    {class}
  >
    <slot />
  </a>
{:else}
  <button
    type="button"
    class="inline-flex items-center justify-center font-semibold rounded-lg transition-colors"
    class:btn-primary={variant === 'primary'}
    class:btn-secondary={variant === 'secondary'}
    class:btn-danger={variant === 'danger'}
    class:px-3={size === 'sm'}
    class:py-2={size === 'sm'}
    class:px-4={size === 'md'}
    class:py-2={size === 'md'}
    class:px-6={size === 'lg'}
    class:py-3={size === 'lg'}
    class:w-full={fullWidth}
    class:opacity-50={disabled || isLoading}
    class:cursor-not-allowed={disabled || isLoading}
    class:text-sm={size === 'sm'}
    class:text-base={size === 'md'}
    class:text-lg={size === 'lg'}
    {disabled}
    {class}
  >
    {#if isLoading}
      <div class="inline-block animate-spin mr-2">
        <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      </div>
    {/if}
    <slot />
  </button>
{/if}
