<script lang="ts">
	import { page } from '$app/stores';

	const { rows } = $page.data;
</script>

<section class="flex flex-col justify-center antialiased min-h-full m-2">
	<div class="max-w-full mx-auto p-4 sm:px-6 h-full">
		<div class="card w-full bg-base-100 border border-base-300 shadow-xl">
			<table class="table table-compact w-full">
				<thead>
					<tr>
						<th>Id</th>
						<th>Role</th>
						<th>Platform</th>
						<th>Tags</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row}
						<tr>
							<td>{row.id}</td>
							<td>{row.role}</td>
							<td>{row.platform}</td>
							<td>{row.tags.length > 0 ? row.tags.join(', ') : 'Por defecto   '}</td>
							<td>{row.status}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>
