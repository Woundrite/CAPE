import { userSettings } from '../store.ts';
import { useStore } from '@nanostores/react'
import toast, { Toaster } from 'react-hot-toast';
const RegExam = (ID: string) => {
	const settings = useStore(userSettings);

	let header = new Headers({
		"Content-Type": "application/json",
		"Authorization": "Token " + settings.authtoken,
		'Access-Control-Allow-Origin': 'http://localhost:8000',
		'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
	});

	let context = {
		"exam_id": ID.ID,
	}

	let reqOpts = {
		method: "POST",
		headers: header,
		body: JSON.stringify(context)
	}
	console.log(settings, reqOpts)

	fetch(settings.apiroot + "register_student_for_test", reqOpts)
		.then(response => response.json())
		.then(result => {
			console.log(result);
			window.location = "/profile/Exams"
		})
		.catch(error => toast.error('error', error));
	return (<></>);
}

export default RegExam;