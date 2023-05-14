<script lang="ts">
	import { page } from "$app/stores";
	import { RoleStore } from "./store";

	const { historyEntries } = $page.data;
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
					<ul class="menu p-4 w-80 bg-base-100 text-base-content">
						{#each historyEntries as history}
							<li><button on:click={() => {RoleStore.set(history.roleForm)}}>{history.roleForm.role}</button></li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
