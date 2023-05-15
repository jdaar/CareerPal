<script lang="ts">
	import { page } from "$app/stores";
	import { ParameterStore } from "../store";

	let { cachedFormData } = $page.data;

    ParameterStore.set(cachedFormData);
</script>

<div class="flex justify-between pl-8 pt-5 pb-0 pr-8 align-center">
    <h1 class="font-bold text-center leading-10 text-2xl">Parametros</h1>
    <label for="my-drawer" class="btn drawer-button">Historial</label>
</div>
<div class="card-body pt-3">

    
    <form method="POST" action="?/execute">
        <div class="form-control pt-2 pb-2">
            <label class="label" for="#role">
                <span class="label-text">Numero de paginas</span>
            </label>
            <label class="input-group input-group-lg">
                <span>Paginas</span>
                <input
                    id="pages"
                    type="number"
                    placeholder="1"
                    name="pages"
                    class="input w-full input-bordered"
                    bind:value={$ParameterStore.pages}
                />
            </label>
        </div>
        <div class="form-control pt-2 pb-2">
            <label class="label" for="#role">
                <span class="label-text">Texto de conexion a origen de datos</span>
            </label>
            <label class="input-group input-group-lg">
                <span>Conexion</span>
                <input
                    id="connection_string"
                    type="text"
                    placeholder="mongodb://localhost:27017/job-info"
                    name="connection_string"
                    class="input w-full input-bordered"
                    bind:value={$ParameterStore.connection_string}
                />
            </label>
        </div>
        <button type="submit" class="btn btn-primary mt-5 w-full">Guardar parametros</button>
    </form>
</div>