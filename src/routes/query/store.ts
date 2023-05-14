import { writable } from "svelte/store";

export const AvailablePlatforms = ['computrabajo', 'indeed', 'linkedin'] as const;

export type TRolePlatform = typeof AvailablePlatforms[number];

export type THistoryEntry = {
    roleForm: TRoleFormData,
    parameterForm: TParameterFormData
}

export type TRoleFormData = {
	role: string;
	platform: TRolePlatform;
	tags: string[];
}

export type TParameterFormData = {
    maxResults: number;
}

export const RoleStore = writable<TRoleFormData>({
    role: "",
    platform: "computrabajo",
    tags: [],
});

export const ParameterStore = writable<TParameterFormData>({
    maxResults: 100
});
