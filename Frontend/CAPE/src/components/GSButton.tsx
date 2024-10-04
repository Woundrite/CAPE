'use client'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, NavbarItem, useDisclosure } from "@nextui-org/react";

const GSButton = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<NavbarItem className="">
			<Button onPress={onOpen} color="primary" className="color-white" href="#" variant="flat">
				Getting Started
			</Button>
			<Modal backdrop="blur" isKeyboardDismissDisabled shouldBlockScroll isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						< div >
							<ModalHeader className="flex flex-col gap-1">Getting Started</ModalHeader>
							<ModalBody>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Nullam pulvinar risus non risus hendrerit venenatis.
									Pellentesque sit amet hendrerit risus, sed porttitor quam.
								</p>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Nullam pulvinar risus non risus hendrerit venenatis.
									Pellentesque sit amet hendrerit risus, sed porttitor quam.
								</p>
								<p>
									Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
									dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.
									Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
									Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur
									proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
									Action
								</Button>
							</ModalFooter>
						</div>
					)}
				</ModalContent>
			</Modal>
		</NavbarItem>
	);

}

export default GSButton;