'use client'
import { Button, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, NavbarItem, useDisclosure } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Input, Link } from "@nextui-org/react";
import { EyeFilledIcon } from "./EyeFilledIcon.tsx";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon.tsx";
import { useState } from "react";
import { isLoginOpen, isRegisterOpen } from "../store.js";

const GSButton = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isVisible, setIsVisible] = useState(false);

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
			<svg aria-hidden="true" fill="none" onClick={closeRegister} focusable="false" height="1em" role="presentation" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="1em">
				<path d="M18 6L6 18M6 6l12 12">
				</path>
			</svg>
		</button>
	);

	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<NavbarItem className="">
			<Button onPress={openRegister} color="primary" className="color-white" href="#" variant="flat">
				Getting Started
			</Button>
			<Modal backdrop="blur" isKeyboardDismissDisabled shouldBlockScroll isOpen={isOpen} onOpenChange={onOpenChange} closeButton={closeButton }>
				<ModalContent>
					{(onClose) => (
						< div className="py-4" >
							<ModalHeader className="flex flex-col gap-1 text-3xl font-bold text-center">Sign Up</ModalHeader>
							<ModalBody className="justify-center">
								<Tabs aria-label="Signup Options" variant="underlined" className="grid justify-center">
									<Tab key="Student" title="Student" className="grid">
										<div className="w-3/4 grid gap-2 justify-self-center">
											<Divider />
											<form action="" className="w-full grid gap-2 justify-self-center">
												<Input type="text" label="Name" className="max-w-xs border-2 rounded-2xl" />
												<Input type="email" label="Email" className="max-w-xs border-2 rounded-2xl" />
												<Input
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
													className="max-w-xs border-2 rounded-2xl"
												/>
												<Input
													label="Re-Enter Password"
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
												<Button onPress={onOpen} color="primary" className="color-white" href="#">
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
									</Tab>
									<Tab key="Teacher" title="Teacher" className="grid">
										<div className="w-3/4 grid gap-2 justify-self-center">
											<Divider />
											<form action="" className="w-full grid gap-2 justify-self-center">
												<Input type="text" label="Name" className="max-w-xs border-2 rounded-2xl" />
												<Input type="email" label="Email" className="max-w-xs border-2 rounded-2xl" />
												<Input
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
													className="max-w-xs border-2 rounded-2xl"
												/>
												<Input
													label="Re-Enter Password"
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
												<Button onPress={onOpen} color="primary" className="color-white" href="#">
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
									</Tab>
								</Tabs>
							</ModalBody>
							<ModalFooter>
							</ModalFooter>
						</div>
					)}
				</ModalContent>
			</Modal>
		</NavbarItem>
	);

}

export default GSButton;