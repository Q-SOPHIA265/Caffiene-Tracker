<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Navigation from '$components/Navigation.svelte';
	import Toast from '$components/Toast.svelte';
</script>

<svelte:head>
	<title>Caffeine Clock - Track Your Caffeine Intake</title>
	<meta name="description" content="Professional caffeine intake tracker with sleep analysis" />
</svelte:head>

<Toast />

<div class="min-h-screen">
	{#if !$page.route.id?.includes('auth')}
		<Navigation />
	{/if}

	<main class="flex-1">
		<slot />
	</main>
</div>
