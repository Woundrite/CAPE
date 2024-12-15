import { Input, Button, Form } from '@nextui-org/react';
import { FaSave } from 'react-icons/fa';
import { useState } from "react";
import { useStore } from '@nanostores/react';
import { userSettings } from '@/store.ts';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
let Settings = () => {
	const settings = useStore(userSettings);
	const [username, setUsername] = useState(settings.username);
	const [email, setEmail] = useState(settings.email);
	const [password, setPassword] = useState("");
	let submit = (e: any) => {
	}
	return (
		<Card className="p-6 w-1/2 h-3/4">
			<CardBody className="">
				<Form className="w-full h-3/4 grid p-8 align-center">
					<Input variant="faded" key={1} type="text" value={username}
						onValueChange={setUsername} label="username"
						className="w-full" labelPlacement="inside" />
					<Input variant="faded" key={2} type="email" value={email}
						onValueChange={setEmail} className="w-full"
						label="Email" labelPlacement="inside" />
					<Input variant="faded" key={3} type="password" value={password}
						onValueChange={setPassword} className="w-full"
						label="Password" labelPlacement="inside" />
					<Button color="primary" className="h-12 w-3/5" onClick={submit}>
						<FaSave /> Save Changes
					</Button>
				</Form>
			</CardBody>
		</Card>
	);
}

export default Settings; 