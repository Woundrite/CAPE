import { userSettings } from '../store.ts';
import { useStore } from '@nanostores/react'

const RegExam = () => {
	const settings = useStore(userSettings);

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
			body: JSON.stringify(context)
		}

		register_student_for_test
	return ();
}

export default RegExam;