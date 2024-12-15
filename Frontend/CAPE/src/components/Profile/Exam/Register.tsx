import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { Button, Textarea, Input } from "@nextui-org/react";
import { useState } from "react";
let Register = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [uuid, setUuid] = useState("");

	let reg = () => {
		if(uuid != "")
			window.location.href = "/Exam/Register/" + uuid;
	}
	return (
		<><Button
			color="primary"
			onClick={() => { isOpen ? onOpenChange() : onOpen() }}
		// className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
		>
			Register Exam
		</Button><Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			isDismissable={true}
			scrollBehavior="inside"
			isKeyboardDismissDisabled
		>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col space-between gap-1">
								Exam Settings
							</ModalHeader>
							<ModalBody>
								<div className="space-y-4">
									<Input
										type="duration"
										label="ID"
										labelPlacement="inside"
										description="Exam ID"
										value={uuid}
										onChange={(e) => setUuid(e.target.value)}
									/>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="primary" onPress={reg}>
									Register
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}

export default Register;