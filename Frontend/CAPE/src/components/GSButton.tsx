'use client'
import { Button, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, NavbarItem, useDisclosure } from "@nextui-org/react";
import { Input, Link } from "@nextui-org/react";
import { EyeFilledIcon } from "./EyeFilledIcon.tsx";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon.tsx";
import { useState } from "react";
import { isLoginOpen, isRegisterOpen } from "../store.js";
import { userSettings } from '../store.ts';
import { useStore } from '@nanostores/react'
import toast, { Toaster } from 'react-hot-toast';
import { Checkbox } from "@nextui-org/react";

const GSButton = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isVisible, setIsVisible] = useState(false);
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [passwordRe, setPasswordRe] = useState("");
	const settings = useStore(userSettings);
	const [isTeacher, setIsTeacher] = useState(false);

	isRegisterOpen.subscribe(open => {
		if (open && !isOpen) {
			onOpenChange();
		} else if (!open && isOpen) {
			onOpenChange();
		}
	});

	const openRegister = () => {
		isRegisterOpen.set(true);
	}

	const closeRegister = () => {
		isRegisterOpen.set(false);
	}

	const switchToLogin = () => {
		isRegisterOpen.set(false);
		isLoginOpen.set(true);
	}

	const closeButton = (
		<button role="button" aria-label="Close" className="absolute appearance-none select-none top-1 right-1 rtl:left-1 rtl:right-[unset] p-2 text-foreground-500 rounded-full hover:bg-default-100 active:bg-default-200 tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2" type="button">
			<svg aria-hidden="true" fill="none" onClick={closeRegister} focusable="false" height="1em" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="1em">
				<path d="M18 6L6 18M6 6l12 12">
				</path>
			</svg>
		</button>
	);

	const toggleVisibility = () => setIsVisible(!isVisible);

	const Register = () => {
		if (password !== passwordRe) {
			toast.error("Passwords do not match");
			return;
		}

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
				"password": password,
				"user_type": isTeacher ? "teacher" : "student",
				"email": email
			})
		}

		fetch(settings.apiroot + "signup", reqOpts)
			.then(response => response.json())
			.then(result => {
				userSettings.setKey("authtoken", result.token);
				userSettings.setKey("username", username);
				userSettings.setKey("email", email);
				userSettings.setKey("type", result.user_type);
			})
			.catch(error => toast.error('error', error));
		closeRegister();
		toast.success("Registered Sucessfully")
	}

	return (
		<NavbarItem className="">
			<Button onPress={openRegister} color="primary" className="color-white" href="#" variant="flat">
				Getting Started
			</Button>
			<Modal backdrop="blur" isKeyboardDismissDisabled shouldBlockScroll isOpen={isOpen} onOpenChange={onOpenChange} closeButton={closeButton}>
				<ModalContent>
					{(onClose) => (
						< div className="py-4" >
							<ModalHeader className="flex flex-col gap-1 text-3xl font-bold text-center">
								Sign Up
							</ModalHeader>

							<ModalBody className="justify-center">
								<div className="grid justify-self-center justify-center">
									<div className="grid gap-2 justify-self-center">
										<form action="" className="w-full grid gap-2 justify-self-center">
											<Input type="text" label="Username" onChange={(event) => { setUsername(event.target.value) }} className="max-w-xs border-2 rounded-2xl" />
											<Input type="email" label="Email" onChange={(event) => { setEmail(event.target.value) }} className="max-w-xs border-2 rounded-2xl" />
											<Input
												label="Password"
												onChange={(event) => { setPassword(event.target.value) }}
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
												className="max-w-xs border-2 rounded-2xl"
											/>
											<Input
												label="Re-Enter Password"
												onChange={(event) => { setPasswordRe(event.target.value) }}
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
												className="max-w-xs border-2 rounded-2xl"
											/>
											<div className="space-x-1 grid grid-cols-[auto_1fr]"><p className="font-semibold">Teacher?</p><Checkbox isSelected={isTeacher} onValueChange={setIsTeacher} radius="md" /></div>
											<Button onPress={Register} color="primary" className="color-white" href="#">
												Register
											</Button>
										</form>
									</div>
									<div className="font-medium text-sm justify-self-center pt-3">
										Already have an account? <Link onClick={switchToLogin} color="foreground" className="hover:underline text-sm font-bold decoration-2 decoration-sky-500" href="#">
											Sign In
										</Link>
									</div>
									<div className="relative flex py-5 items-center">
										<div className="flex-grow border-t border-gray-900"></div>
										<span className="flex-shrink mx-2 font-bold text-gray-900">or</span>
										<div className="flex-grow border-t border-gray-900"></div>
									</div>
									<div className="w-full grid grid-cols-3"></div>
								</div>
							</ModalBody>
						</div>
					)}
				</ModalContent>
			</Modal>
		</NavbarItem>
	);

}

export default GSButton;