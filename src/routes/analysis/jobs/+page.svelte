<script lang="ts">
	import { page } from '$app/stores';
	import type { TJobInfo } from '$lib/scraper/lib/platform';

	const rows: TJobInfo[] = $page.data.rows;
</script>

<table class="table table-compact w-full max-w-full">
	<thead>
		<tr>
			<th>Titulo</th>
			<th>Busqueda original</th>
			<th>Compañia</th>
			<th>Ubicacion</th>
			<th>Compensacion</th>
			<th>Tags</th>
			<th>Experiencia</th>
			<th>Url</th>
		</tr>
	</thead>
	<tbody>
		{#each rows as row}
			<tr>
				<td>{row.title ?? 'No registra'}</td>
				<td>{row.role_search ?? 'No registra'}</td>
				<td>{row.company ?? 'No registra'}</td>
				<td>{row.location ?? 'No registra'}</td>
				<td>{row.salary ?? 'No registra'}</td>
				<td>{row.technologies.join(', ') ?? 'No registra'}</td>
				<td>{row.experience ?? 'No registra'}</td>
				<td><a class="btn btn-active" href={row.url}>Ir a la oferta</a></td>
			</tr>
		{/each}
	</tbody>
</table>
