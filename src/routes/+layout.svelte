<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import './styles.css';
</script>

<div class="navbar bg-base-100 p-5">
	<div class="navbar-start">
		<a href="/" class="p-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
				/>
				<polyline points="9 22 9 12 15 12 15 22"/>
			</svg>
		</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="steps">
			{#if $page.url.pathname.startsWith('/query')}
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
			{#if $page.url.pathname === '/status'}
				<li class="step step-primary">
					<a href="/status">
						Status
					</a>
				</li>
			{:else}
				<li class="step">
					<a href="/status">
						Status
					</a>
				</li>
			{/if}
			{#if $page.url.pathname.startsWith('/analysis')}
				<li class="step step-primary">
					<a href="/analysis/role">
						Analisis
					</a>
				</li>
			{:else}
				<li class="step">
					<a href="/analysis/role">
						Analisis
					</a>
				</li>
			{/if}
		</ul>
	</div>
	<div class="navbar-end">
		{#if $page.url.pathname !== '/query/execute' && $page.url.pathname.startsWith('/query')}
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
		{#if !$page.url.pathname.startsWith('/analysis')}
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
