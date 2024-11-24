'use client'
import { Button, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, NavbarItem, useDisclosure, ButtonGroup } from "@nextui-org/react";
import { Input, Link } from "@nextui-org/react";
import { EyeFilledIcon } from "./EyeFilledIcon.tsx";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon.tsx";
import { useState } from "react";
import { isLoginOpen, isRegisterOpen } from "../store.ts";
import { userSettings } from '../store.ts';
import { useStore } from '@nanostores/react'
import toast, { Toaster } from 'react-hot-toast';

const LoginButton = () => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const [isVisible, setIsVisible] = useState(false);
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const settings = useStore(userSettings);

	isLoginOpen.subscribe(open => {
		if (open && !isOpen) {
			onOpenChange();
		} else if (!open && isOpen) {
			onOpenChange();
		}
	});

	const openLogin = () => {
		isLoginOpen.set(true);
	}

	const closeLogin = () => {
		isLoginOpen.set(false);
	}

	const SignIn = () => {

		let header = new Headers({
			"Content-Type": "application/json",
			"Authorization": "Token " + settings.authtoken,
			'Access-Control-Allow-Origin': 'http://localhost:8000',
			'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
			'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
		});

		let reqOpts = {
			method: "POST",
			headers: header,
			body: JSON.stringify({
				"username": username,
				"password": password
			})
		}

		fetch(settings.apiroot + "login", reqOpts)
			.then(response => response.json())
			.then(result => {
				userSettings.setKey("authtoken" ,result.token);
				userSettings.setKey("username", result.user.username);
				userSettings.setKey("email" ,result.user.email);
			})
			.catch(error => console.log('error', error));
		closeLogin();
		toast.success("Logged In Sucessfully")
	}

	const switchToRegister = () => {
		isLoginOpen.set(false);
		isRegisterOpen.set(true);
	}

	const closeButton = (
		<button role="button" aria-label="Close" className="absolute appearance-none select-none top-1 right-1 rtl:left-1 rtl:right-[unset] p-2 text-foreground-500 rounded-full hover:bg-default-100 active:bg-default-200 tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2" type="button">
			<svg aria-hidden="true" fill="none" onClick={closeLogin} focusable="false" height="1em" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="1em">
				<path d="M18 6L6 18M6 6l12 12">
				</path>
			</svg>
		</button>
	);

	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<NavbarItem className="">
			<Button onPress={openLogin} className="rounded-xl border-2 bg-white" href="#" variant="flat">Login</Button>
			<Modal backdrop="blur" isKeyboardDismissDisabled shouldBlockScroll isOpen={isOpen} onOpenChange={onOpenChange} closeButton={closeButton}>
				<ModalContent>
					{(closeLogin) => (
						< div className="py-8">
							<ModalHeader className="grid grid-col font-bold text-3xl gap-1 content-center justify-center ">Lets Sign you in</ModalHeader>
							<ModalBody className="justify-center">
								<div className="w-full h-full grid gap-4">
									<div className="w-full">
										<p className="text-xl font-semibold w-full grid content-center justify-center">Welcome Back ,</p>
										<p className="text-xl font-semibold w-full grid content-center justify-center">You have been missed</p>
									</div>
									<div className="w-3/4 grid gap-2 justify-self-center">
										<Divider />
										<div className="w-full grid gap-2 justify-self-center">
											<Input type="text" label="Username" onChange={(event) => { setUsername(event.target.value) }} />
											<Input onChange={(event) => { setPassword(event.target.value) }}
												label="Password"
												endContent={
													<button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
														{isVisible ? (
															<EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
														) : (
															<EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
														)}
													</button>
												}
												type={isVisible ? "text" : "password"}
												className="max-w-xs"
											/>
											<Button onPress={SignIn} color="primary" className="color-white" href="#">
												Sign-In
											</Button>
										</div>
										<Link color="foreground" className="hover:underline justify-self-end hover:font-bold font-bold decoration-2 decoration-sky-500" href="/">
											Forgot Password?
										</Link>
										<div className="font-medium text-sm justify-self-center pt-3">
											Don't have an account? <Link onClick={switchToRegister} color="foreground" className="hover:underline text-sm font-bold decoration-2 decoration-sky-500" href="#">
												Register
											</Link>
										</div>
									</div>
								</div>
								<div className="relative flex py-5 items-center">
									<div className="flex-grow border-t border-gray-900"></div>
									<span className="flex-shrink mx-2 font-bold text-gray-900">or</span>
									<div className="flex-grow border-t border-gray-900"></div>
								</div>
								<div className="w-full grid grid-cols-3"></div>

							</ModalBody>
						</div>
					)}
				</ModalContent>
			</Modal>
		</NavbarItem>
	);

}

export default LoginButton;