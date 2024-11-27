import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Image, Button } from "@nextui-org/react";
import type { ComponentInstance } from "astro";
import LoginButton from "./LoginButton";
import GSButton from "./GSButton";
import { userSettings } from '../store.ts';
import { useStore } from '@nanostores/react'
import { listenKeys } from 'nanostores';
import { useState } from 'react';
import UserComponent from "./UserComponent.tsx";

const Nav = (Props: any) => {
	const settings = useStore(userSettings);
	const [loggedin, setloggedin] = useState(typeof settings.authtoken === "string" && (settings.authtoken || "").length > 0);
	console.log(typeof settings.authtoken === "string")
	listenKeys(userSettings, ['authtoken'], (value, oldValue, changed) => {
		setloggedin(typeof settings.authtoken === "string" && (settings.authtoken || "").length > 0);
	});

	return (
		<Navbar shouldHideOnScroll className="full:flex w-100" maxWidth={'full'}>
			<NavbarBrand className="basis-5/12">
				<Link href={"/"} className="font-bold text-inherit">CAPE</Link>
			</NavbarBrand>
			<NavbarContent className="flex gap-4 basis-4/12" justify="end">
				<NavbarItem isActive>
					{Props.Active == "Home" ? (
						<Link color="foreground" className="hover:underline hover:font-bold font-bold decoration-2 decoration-sky-500" href="/">
							Home
						</Link>
					) : (
						<Link color="foreground" className="hover:underline hover:font-bold decoration-2 decoration-sky-500" href="/">
							Home
						</Link>
					)}

				</NavbarItem>
				<NavbarItem>
					{Props.Active == "About" ? (
						<Link color="foreground" className="hover:underline hover:font-bold font-bold decoration-2 decoration-sky-500" href="/#About">
							About
						</Link>
					) : (
						<Link color="foreground" className="hover:underline hover:font-bold decoration-2 decoration-sky-500" href="/#About">
							About
						</Link>
					)}
				</NavbarItem>
				<NavbarItem>
					{Props.Active == "Resources" ? (
						<Link color="foreground" className="hover:underline hover:font-bold font-bold decoration-2 decoration-sky-500" href="/#Review">
							Reviews
						</Link>
					) : (
						<Link color="foreground" className="hover:underline hover:font-bold decoration-2 decoration-sky-500" href="/#Review">
							Reviews
						</Link>
					)}
				</NavbarItem>

				<NavbarItem>
					{Props.Active == "Contact" ? (
						<Link color="foreground" className="hover:underline hover:font-bold font-bold decoration-2 decoration-sky-500" href="/Contact">
							Contact
						</Link>
					) : (
						<Link color="foreground" className="hover:underline hover:font-bold decoration-2 decoration-sky-500" href="/Contact">
							Contact
						</Link>
					)}
				</NavbarItem>
			</NavbarContent>
			{
				loggedin ? (
					<UserComponent />
				) : (
					<NavbarContent justify="start" className="object-contain basis-3/12">
						<LoginButton />
						<GSButton />
					</NavbarContent>
				)
			}
		</Navbar >
	);
}

export default Nav;