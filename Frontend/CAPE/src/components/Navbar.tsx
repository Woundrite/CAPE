import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Image, Button } from "@nextui-org/react";
import type { ComponentInstance } from "astro";
import LoginButton from "./LoginButton";
import GSButton from "./GSButton";


const Nav = (Props: any) => {
	return (
		<Navbar shouldHideOnScroll className="full:flex w-100" maxWidth={'full'}>
			<NavbarBrand className="basis-5/12">
				<p className="font-bold text-inherit">CAPE</p>
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
			<NavbarContent justify="start" className="object-contain basis-3/12">
				<LoginButton />
				<GSButton />
			</NavbarContent>
		</Navbar >
	);
}

export default Nav;