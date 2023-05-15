import type { TParameterFormData, TRoleFormData } from "../store";
import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies }) => {
    const cachedParameterFormData: { type: "parameter", data: TParameterFormData } = JSON.parse(cookies.get('cachedParameterFormData') ?? '{}');
    const cachedRoleFormData: { type: "role", data: TRoleFormData } = JSON.parse(cookies.get('cachedRoleFormData') ?? '{}');

    return {
        cachedParameterFormData,
        cachedRoleFormData
    };
}) satisfies PageServerLoad;