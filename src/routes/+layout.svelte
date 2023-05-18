<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import './styles.css';
</script>

<div class="navbar bg-base-100 p-5">
	<div class="navbar-start">
		<a href="/" class="p-2">
			<svg
				width="50"
				height="41"
				viewBox="0 0 409 338"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M15 77H206" stroke="#A6ADBB" stroke-width="30" stroke-linecap="round" />
				<path d="M15 157H168" stroke="#A6ADBB" stroke-width="30" stroke-linecap="round" />
				<path d="M15 237H136" stroke="#A6ADBB" stroke-width="30" stroke-linecap="round" />
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M258 107H181V47H258C274.569 47 288 60.4315 288 77C288 93.5685 274.569 107 258 107ZM307 187H170L183.048 127H307C323.569 127 337 140.431 337 157C337 173.569 323.569 187 307 187Z"
					fill="#661AE6"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M183 124C183 175.6 225.777 218 278.008 218C330.24 218 373.016 175.6 373.016 124C373.016 72.4003 330.24 30 278.008 30C225.777 30 183 72.4003 183 124ZM278.008 0C209.525 0 153 55.5167 153 124C153 192.483 209.525 248 278.008 248C346.491 248 403.016 192.483 403.016 124C403.016 55.5167 346.491 0 278.008 0Z"
					fill="#661AE6"
				/>
				<path d="M189 127C184.2 127 183 124.667 183 123V127H189Z" fill="#661AE6" />
				<path d="M229 47C224.2 47 225.5 46 227.5 44.5L223 47H229Z" fill="#661AE6" />
				<path d="M191 107C186.569 107 184.5 108 184.07 109.95L184 107H191Z" fill="#661AE6" />
				<path d="M214 187C209.569 187 208.58 187.5 209.58 189L207 187H214Z" fill="#661AE6" />
				<path
					d="M360.888 323.664C367.329 335.876 382.451 340.554 394.664 334.112C406.876 327.671 411.554 312.549 405.112 300.336L360.888 323.664ZM312.888 232.664L360.888 323.664L405.112 300.336L357.112 209.336L312.888 232.664Z"
					fill="#661AE6"
				/>
			</svg>
		</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="steps">
			{#if $page.url.pathname.startsWith('/query')}
				<li class="step step-primary">
					<a href="/query/role"> Parametrizacion del query </a>
				</li>
			{:else}
				<li class="step">
					<a href="/query/role"> Parametrizacion del query </a>
				</li>
			{/if}
			{#if $page.url.pathname === '/status'}
				<li class="step step-primary">
					<a href="/status"> Status </a>
				</li>
			{:else}
				<li class="step">
					<a href="/status"> Status </a>
				</li>
			{/if}
			{#if $page.url.pathname.startsWith('/analysis')}
				<li class="step step-primary">
					<a href="/analysis/role"> Analisis </a>
				</li>
			{:else}
				<li class="step">
					<a href="/analysis/role"> Analisis </a>
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
				<a href="/query/role"> Parametrizacion del query </a>
			</li>
		{:else}
			<li class="step">
				<a href="/query/role"> Parametrizacion del query </a>
			</li>
		{/if}
		{#if $page.url.pathname === '/analysis'}
			<li class="step step-primary">
				<a href="/analysis"> Analisis </a>
			</li>
		{:else}
			<li class="step">
				<a href="/analysis"> Analisis </a>
			</li>
		{/if}
	</ul>
</div>
