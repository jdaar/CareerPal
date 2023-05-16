<script lang="ts">
	import { page } from "$app/stores";
	import { ParameterStore, RoleStore, type THistoryEntry } from "./store";

	let historyEntries: Array<THistoryEntry> = $page.data.historyEntries;

	let historySelectCallback = (history: THistoryEntry) => {
		if (history.type === 'role') RoleStore.set(history.data);
		if (history.type === 'parameter') ParameterStore.set(history.data);
	}
</script>

<div class="flex justify-center align-center p-5 pt-10">
	<div class="flex-col w-9/12 lg:w-1/2">
		<div class="tabs ml-5">
			<a class="tab tab-lifted tab-active" class:tab-active={$page.url.pathname=='/query/role'} href="/query/role">Rol</a>
			<a class="tab tab-lifted" class:tab-active={$page.url.pathname=='/query/parameters'} href="/query/parameters">Parametros</a>
		</div>
		<div class="card w-full bg-base-100 border border-base-300 shadow-xl">
			<div class="drawer drawer-end h-1/3">
				<input id="my-drawer" type="checkbox" class="drawer-toggle" />
				<div class="drawer-content h-full">
                    <slot />
                </div>
				<div class="drawer-side">
					<label for="my-drawer" class="drawer-overlay" />
					<ul class="menu p-4 w-80 bg-base-100 text-base-content h-full">
						{#each historyEntries as history}
							{#if history.type === 'role' && $page.url.pathname=='/query/role'}
								<li><button on:click|preventDefault={() => historySelectCallback(history)}>{history.data.role}</button></li>
							{/if}
							{#if history.type === 'parameter' && $page.url.pathname=='/query/parameters'}
								<div class="max-h-96">
									<li><button on:click|preventDefault={() => historySelectCallback(history)}>{`C-${history.data.connection_string}_P-${history.data.pages}`}</button></li>
								</div>
							{/if}
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
