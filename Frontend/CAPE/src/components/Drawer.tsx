import React, { useState } from "react";
import { Button, Divider } from "@nextui-org/react";
import { FiX } from "react-icons/fi";

interface DrawerProps {
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	trigger: React.ReactNode;
	id?: string;

}

const Drawer: React.FC<DrawerProps> = ({ onClose, id, title, children, trigger }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="w-full">
			<button className="w-full" onClick={() => setIsOpen(!isOpen)}>{trigger}</button>
			<div
				className={`fixed inset-0 z-50 transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"
					}`}
			>
				<div
					className={`fixed inset-0 bg-black/50 delay-300 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"
						}`}
					onClick={() => { setIsOpen(!isOpen) }}
				></div>

				{/* Backdrop */}
				<div className={`
						fixed left-0 top-0 
						h-full bg-white shadow-lg
						flex flex-col transform transition-transform
						${isOpen ? "translate-x-0" : "-translate-x-full"}`
				} >

					{/* Header */}
					<div className="flex justify-between items-center p-4 w-[30vw] border-b">
						<h4>{title || "Drawer Title"}</h4>
						<Button onClick={() => setIsOpen(!isOpen)}>X</Button>
					</div>

					{/* Divider */}
					<Divider />

					{/* Content */}
					<div className="flex-1 p-4 [&::-webkit-scrollbar]:w-2
						[&::-webkit-scrollbar-track]:rounded-full
						[&::-webkit-scrollbar-track]:bg-gray-100
						[&::-webkit-scrollbar-thumb]:rounded-full
						[&::-webkit-scrollbar-thumb]:bg-gray-300
						dark:[&::-webkit-scrollbar-track]:bg-neutral-700
						dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 overflow-y-auto w-[30vw]">
						{children}
					</div>

				</div>
			</div>
		</div>
	);
};

export default Drawer;
