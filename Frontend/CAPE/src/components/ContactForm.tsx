import { Input, Button, Textarea } from '@nextui-org/react';
import { useState } from "react";
import { userSettings } from '../store.ts';
import { useStore } from '@nanostores/react';
import toast, { Toaster } from 'react-hot-toast';

const ContactForm = () => {
	const settings = useStore(userSettings);

	const [sub, setSub] = useState("");
	const [email, setEmail] = useState("");
	const [msg, setMsg] = useState("");


	const handleSubmit = async (e: any) => {
		e.preventDefault();

		let header = new Headers({
			"Content-Type": "application/json",
			'Access-Control-Allow-Origin': 'http://localhost:8000',
			'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
			'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
		});
		let reqOpts = {
			method: "POST",
			headers: header,
			body: JSON.stringify({
				"subject": sub,
				"address": email,
				"message": msg
			})
		}
		fetch(settings.apiroot + "send_mail_page", reqOpts)
			.then(response => response.json())
			.then(result => { })
			.catch(error => toast.error('error', error));

	}


	return (
		<div className="w-full max-w-lg">

			<h1 className="font-bold text-center text-3xl mb-4">
				Contact Us
			</h1>
			<p className="font-bold text-center mb-4">
				Please provide us some contact info to reach out to you.
			</p>
			<form
				className="grid grid-rows-5 gap-4"
			>
				<Input
					type="text"
					label="Subject"
					placeholder="Enter your subject"
					value={sub}
					onChange={(e) => { setSub(e.target.value) }}
					className="max-w-2xs border-2 rounded-2xl"
				/>
				<Input
					type="email"
					label="Email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => { setEmail(e.target.value) }}
					className="max-w-2xs border-2 rounded-2xl"
				/>
				<Textarea
					label="Message"
					placeholder="Enter your message"
					value={msg}
					onChange={(e) => { setMsg(e.target.value) }}
					className="max-w-2xs row-span-2 border-2 rounded-2xl"
				/>
				<Button
					color="primary"
					className="transition-transform duration-200
						ease-in-out transform hover:scale-105 hover:bg-blue-700"
					onClick={handleSubmit}
				>
					Submit</Button>
			</form>
		</div>
	)
}

export default ContactForm