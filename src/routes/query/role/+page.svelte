<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, deserialize } from '$app/forms';
	import { writable } from 'svelte/store';
    import { RoleStore } from '../store';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';

	let { cachedFormData, availablePlatforms } = $page.data;

    RoleStore.set({
        platform: 'computrabajo',
        role: '',
        ...cachedFormData,
    });

    let tagSearchInput = writable<string>("");

    const removeTag = (tag: string) => {
        $RoleStore.tags = $RoleStore.tags.filter(v => v !== tag);
    }

    const handleSubmit: svelte.JSX.EventHandler<Event, HTMLFormElement> = async (event) => {
        if (event.target instanceof HTMLFormElement) {
            const data = new FormData(event.target);
            data.append('tags', $RoleStore.tags.join(':'));

            const response = await fetch(event.target.action, {
                method: 'POST',
                body: data
            });

            const result: ActionResult = deserialize(await response.text());

            if (result.type === 'success') {
                await invalidateAll();
            }

            applyAction(result);
        }
    }
</script>

<div class="flex justify-between pl-8 pt-5 pb-0 pr-8 align-center">
    <h1 class="font-bold text-center leading-10 text-2xl">Datos del rol</h1>
    <label for="my-drawer" class="btn drawer-button">Historial</label>
</div>
<div class="card-body pt-3">
    <form method="POST" action="?/execute" on:submit|preventDefault={handleSubmit}>
        <div class="form-control pt-2 pb-2">
            <label class="label" for="#role">
                <span class="label-text">Rol que desea desempeñar</span>
            </label>
            <label class="input-group input-group-lg">
                <span>Rol</span>
                <input
                    id="role"
                    type="text"
                    placeholder="Desarrollador web"
                    name="role"
                    class="input w-full input-bordered"
                    bind:value={$RoleStore.role}
                />
            </label>
        </div>
        <div class="form-control pt-2 pb-2">
            <label class="label" for="tag-search">
                <span class="label-text">Tecnologias usadas en el rol</span>
            </label>
                <div class="flex flex-row pb-3 gap-2">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    {#each $RoleStore.tags as tag}
                        <div class="badge badge-primary badge-lg gap-2" on:click={() => {removeTag(tag)}}>
                            {tag}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                class="inline-block w-4 h-4 stroke-current"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                /></svg
                            >
                        </div>
                    {/each}
                </div>
            <label class="input-group input-group-lg">
                <input type="text" placeholder="Search…" class="input w-full input-bordered" id="tag-search" bind:value={$tagSearchInput} />
                <button class="btn btn-square" on:click={(event) => {
                    event.preventDefault();
                    $RoleStore.tags = [...$RoleStore.tags, $tagSearchInput];
                    $tagSearchInput = "";
                }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        /></svg
                    >
                </button>
            </label>
        </div>
        <div class="form-control pt-2 pb-2">
            <label class="label" for="platform">
                <span class="label-text">Plataformas de busqueda</span>
            </label>
            <label class="input-group input-group-lg" id="platform">
                <div class="btn-group flex-col w-full lg:flex-row">
                    {#each availablePlatforms as platform}
                        <input type="radio" data-title="{platform}" class="btn" name="platform" value={platform} bind:group={$RoleStore.platform}/>
                    {/each}
                </div>
            </label>
        </div>
        <button type="submit" class="btn btn-primary mt-5 w-full">Guardar rol</button>
    </form>
</div>
