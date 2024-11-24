import { atom } from 'nanostores';
import { persistentMap } from '@nanostores/persistent';

export const isLoginOpen = atom(false);
export const isRegisterOpen = atom(false);

export type UserSettingsType = {
	username: string,
	theme: "light" | "dark" | "auto",
	authtoken: string,
	apiroot: "http://localhost:8000/api/",
	email: string,
}

export const userSettings = persistentMap<UserSettingsType>('userSettings', {
	username: "",
	theme: "light",
	authtoken: "",
	apiroot: "http://localhost:8000/api/",
	email: "",
})