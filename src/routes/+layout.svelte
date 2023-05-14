<script>
	import './styles.css';
</script>

<div class="navbar bg-base-100 p-5">
	<div class="navbar-start">
		<p class="normal-case text-xl font-bold pl-2">JobSearch (WIP)</p>
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
		<button class="btn btn-primary">Ejecutar</button>
	</div>
</div>
<div class="app">
	<main>
		<slot />
	</main>
</div>
<div class="flex lg:hidden justify-center p-10">
	<ul class="steps">
		<a href="/query/role">
			<li class="step step-primary">Parametrizacion del query</li>
		</a>
		<li class="step">Analisis</li>
	</ul>
</div>

<style>
</style>
