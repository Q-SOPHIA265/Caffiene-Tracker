<script lang="ts">
  export let title: string = '';
  export let description: string = '';
  export let class: string = '';
</script>

<div class="card {class}">
  {#if title}
    <h3 class="text-lg font-semibold text-primary-400 mb-2">{title}</h3>
  {/if}
  {#if description}
    <p class="text-dark-300 mb-4">{description}</p>
  {/if}
  <slot />
</div>
