<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import './styles.css';
</script>

<div class="navbar bg-base-100 p-5">
	<div class="navbar-start">
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="steps">
			<a href="/query/role">
				<li class="step step-primary">Parametrizacion del query</li>
			</a>
			<li class="step">Analisis</li>
		</ul>
	</div>
	<div class="navbar-end">
		{#if $page.url.pathname !== '/query/execute'}
			<button class="btn btn-primary" on:click={() => goto('/query/execute')}>Ejecutar</button>
		{/if}
	</div>
</div>
<div class="app">
	<main>
		<slot />
	</main>
</div>
<div class="flex lg:hidden justify-center p-10">
	<ul class="steps">
			{#if $page.url.pathname !== '/analysis'}
				<li class="step step-primary">
					<a href="/query/role">
						Parametrizacion del query
					</a>
				</li>
			{:else}
				<li class="step">
					<a href="/query/role">
						Parametrizacion del query
					</a>
				</li>
			{/if}
		{#if $page.url.pathname === '/analysis'}
			<li class="step step-primary">
				<a href="/analysis">
					Analisis
				</a>
			</li>
		{:else}
			<li class="step">
				<a href="/analysis">
					Analisis
				</a>
			</li>
		{/if}
	</ul>
</div>
