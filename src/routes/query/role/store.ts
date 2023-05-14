import { writable } from "svelte/store";

export const AvailablePlatforms = ['computrabajo', 'indeed', 'linkedin'] as const;

export type RolePlatform = typeof AvailablePlatforms[number];

export type RoleFormData = {
	role: string;
	platform: RolePlatform;
	tags: string[];
}

export type ParameterFormData = {
    maxResults: number;
}

export const roleStore = writable<RoleFormData>({
    role: "",
    platform: "computrabajo",
    tags: [],
});

export const parameterStore = writable<ParameterFormData>({
    maxResults: 100
});
