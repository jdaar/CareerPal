<script lang="ts">
	import { page } from "$app/stores";
	import type { TParameterFormData, TRoleFormData } from "../store";

    let cachedParameterFormData: TParameterFormData = $page.data.cachedParameterFormData.data;
    let cachedRoleFormData: TRoleFormData = $page.data.cachedRoleFormData.data;
</script>

<div class="flex justify-between pl-8 pt-5 pb-0 pr-8 align-center">
    <h1 class="font-bold text-center leading-10 text-2xl">Programar trabajo</h1>
</div>
<div class="card-body pt-3">
    <h2 class="font-bold leading-10 text-xl">Datos del rol</h2>
    {#if cachedRoleFormData !== null && cachedRoleFormData !== undefined}
        <p><span class="font-bold">Rol</span>: {cachedRoleFormData.role}</p>
        <p><span class="font-bold">Plataforma</span>: {cachedRoleFormData.platform}</p>
        <p><span class="font-bold">Tags</span>: {cachedRoleFormData.tags.length > 0 ? cachedRoleFormData.tags.join(', '): 'Por defecto'}</p>
    {:else}
        <p>Diligencia el formulario</p>
    {/if}

    <h2 class="font-bold leading-10 text-xl">Parametros</h2>
    {#if cachedParameterFormData !== null && cachedParameterFormData !== undefined}
        <p><span class="font-bold">Texto de conexion</span>: {cachedParameterFormData.connection_string}</p>
        <p><span class="font-bold">Numero de paginas</span>: {cachedParameterFormData.pages}</p>
    {:else}
        <p>Diligencia el formulario</p>
    {/if}

    <br/>
    <br/>
    <form method="POST" action="?/execute">
        <button class="btn btn-primary" type="submit">Iniciar trabajo</button>
    </form>
</div> 
