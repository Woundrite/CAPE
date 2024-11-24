import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Image, Button } from "@nextui-org/react";
import type { ComponentInstance } from "astro";
import LoginButton from "./LoginButton";
import GSButton from "./GSButton";
import { userSettings } from '../store.ts';
import { useStore } from '@nanostores/react'
import { listenKeys } from 'nanostores';
import { useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";

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
						<Link color="foreground" className="hover:underline hover:font-bold font-bold decoration-2 decoration-sky-500" href="/Resources">
							Reviews
						</Link>
					) : (
						<Link color="foreground" className="hover:underline hover:font-bold decoration-2 decoration-sky-500" href="/Resources">
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
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Avatar showFallback src={'https://ui-avatars.com/api/?background=random&name=' + settings.username} />
						</DropdownTrigger>
						<DropdownMenu aria-label="Profile Actions" variant="flat">
							<DropdownItem key="profile" className="h-14 gap-2">
								<p className="font-semibold">Signed in as</p>
								<p className="font-semibold">{settings.email}</p>
							</DropdownItem>
							<DropdownItem key="dashboard" as={Link} href="/profile/dashboard" className="text-black">
								Dashboard
							</DropdownItem>
							<DropdownItem key="team_settings">Team Settings</DropdownItem>
							<DropdownItem key="analytics">
								Analytics
							</DropdownItem>
							<DropdownItem key="system">System</DropdownItem>
							<DropdownItem key="logout" color="danger" as={Link} href="/signout" className="text-black">
								Log Out
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
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