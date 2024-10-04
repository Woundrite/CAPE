'use client'
import { Button, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, NavbarItem, useDisclosure } from "@nextui-org/react";
import { Input, Link } from "@nextui-org/react";
import { EyeFilledIcon } from "./EyeFilledIcon.tsx";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon.tsx";
import { useState } from "react";

const LoginButton = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<NavbarItem className="">
			<Button onPress={onOpen} className="rounded-xl border-2 bg-white" href="#" variant="flat">Login</Button>
			<Modal backdrop="blur"  isKeyboardDismissDisabled shouldBlockScroll isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
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
										<form action="" className="w-full grid gap-2 justify-self-center">
											<Input type="email" label="Email" />
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
												className="max-w-xs"
											/>
											<Button onPress={onOpen} color="primary" className="color-white" href="#">
												Sign-In
											</Button>
										</form>
										<Link color="foreground" className="hover:underline justify-self-end hover:font-bold font-bold decoration-2 decoration-sky-500" href="/">
											Forgot Password?
										</Link>
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