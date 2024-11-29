import React from "react";
import { Button, Switch, Input } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Link } from "@nextui-org/react";

// Define the props for the SettingsModal component
interface SettingsModalProps {
	visible: boolean;
	onClose: () => void;
	settings: {
		darkMode: boolean;
		notifications: boolean;
		questionLimit: number;
	};
	onToggle: (setting: keyof typeof defaultSettings) => void;
	onLimitChange: (value: number) => void;
}

// Default settings structure
const defaultSettings = {
	darkMode: false,
	notifications: true,
	questionLimit: 100,
};

const SettingsModal: React.FC<SettingsModalProps> = ({
	visible,
	onClose,
	settings,
	onToggle,
	onLimitChange,
}) => {
	return (
		<Modal isOpen={visible} onClose={onClose} closeButton blur>
			<ModalHeader>
				<h2 className="text-lg font-semibold">Application Settings</h2>
			</ModalHeader>
			<ModalBody>
				<div className="space-y-4">
					{/* Dark Mode Toggle */}
					<div className="flex items-center justify-between">
						<span>Dark Mode</span>
						<Switch
							checked={settings.darkMode}
							onChange={() => onToggle("darkMode")}
						/>
					</div>

					{/* Notifications Toggle */}
					<div className="flex items-center justify-between">
						<span>Enable Notifications</span>
						<Switch
							checked={settings.notifications}
							onChange={() => onToggle("notifications")}
						/>
					</div>

					{/* Question Limit Input */}
					<div>
						<span>Question Limit</span>
						<Input
							type="number"
							value={settings.questionLimit}
							onChange={(e) =>
								onLimitChange(Number(e.target.value))
							}
							className="mt-2"
						/>
					</div>
				</div>
			</ModalBody>
			<ModalFooter>
				<Button auto flat color="danger" onClick={onClose}>
					Cancel
				</Button>
				<Button auto onClick={onClose}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};

export default SettingsModal;
