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
    <h2 class="font-bold text-center leading-10 text-2xl">Se ejecutara con la siguiente informacion</h2>
    <p>{cachedRoleFormData.role}</p>
    <p>{cachedRoleFormData.platform}</p>
    <p>{cachedRoleFormData.tags.join(', ')}</p>

    <h2 class="font-bold text-center leading-10 text-2xl">Se ejecutara con la siguiente informacion</h2>
    <p>{cachedParameterFormData.connection_string}</p>
    <p>{cachedParameterFormData.pages}</p>
</div> 