import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Image, Button } from "@nextui-org/react";
import type { ComponentInstance } from "astro";
import LoginButton from "./LoginButton";
import GSButton from "./GSButton";

interface ActiveJSON {
	Active: string,
	children: ComponentInstance
}

const Nav = (Active: ActiveJSON) => {
	return (
		<Navbar shouldHideOnScroll className="full:flex w-100" maxWidth={'full'} transition:persist>
			<NavbarBrand className="basis-5/12">
				<p className="font-bold text-inherit">CAPE</p>
			</NavbarBrand>
			<NavbarContent className="hidden flex gap-4 basis-4/12" justify="end">
				<NavbarItem isActive>
					{Active.Active == "Home" ? (
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
					{Active.Active == "About" ? (
						<Link color="foreground" className="hover:underline hover:font-bold font-bold decoration-2 decoration-sky-500" href="/About">
							About
						</Link>
					) : (
						<Link color="foreground" className="hover:underline hover:font-bold decoration-2 decoration-sky-500" href="/About">
							About
						</Link>
					)}
				</NavbarItem>
				<NavbarItem>
					{Active.Active == "Resources" ? (
						<Link color="foreground" className="hover:underline hover:font-bold font-bold decoration-2 decoration-sky-500" href="/Resources">
							Resources
						</Link>
					) : (
						<Link color="foreground" className="hover:underline hover:font-bold decoration-2 decoration-sky-500" href="/Resources">
							Resources
						</Link>
					)}
				</NavbarItem>

				<NavbarItem>
					{Active.Active == "Contact" ? (
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
			<NavbarContent justify="start" className="object-contain basis-3/12">
				<LoginButton />
				<GSButton />
			</NavbarContent>
		</Navbar >
	);
}

export default Nav;