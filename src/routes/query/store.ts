import { writable } from "svelte/store";

export const AvailablePlatforms = ['computrabajo', 'indeed', 'linkedin'] as const;

export type TRolePlatform = typeof AvailablePlatforms[number];

type TRoleHistoryEntry = {
    type: "role",
    data: TRoleFormData
}

type TParameterHistoryEntry = {
    type: "parameter",
    data: TParameterFormData
}

export type THistoryEntry = TRoleHistoryEntry | TParameterHistoryEntry;


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
