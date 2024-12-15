import { useStore } from '@nanostores/react'
import { userSettings } from '../store.ts';
import { useState, useEffect } from 'react';
import { Link, Button } from '@nextui-org/react';
import toast, { Toaster } from 'react-hot-toast';
const ExamTT = () => {
	const settings = useStore(userSettings);
	let upcoming = null;
	let count = 1;

	let header = new Headers({
		"Content-Type": "application/json",
		"Authorization": "Token " + settings.authtoken,
		'Access-Control-Allow-Origin': 'http://localhost:8000',
		'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
	});

	let reqOpts = {
		method: "GET",
		headers: header,
	}

	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState([]);

	const SecToText = (time: number) => {
		if (time < 60)
			return String(time) + "s";
		else if (time < 3600)
			return String(time / 60) + "m " + String(time % 60) + "s";
		else
			return String(time / 3600) + "h " + String(time % 3600 / 60) + "m " + String(time % 60) + "s";
	}

	if (Object.keys(userData).length === 0 && isLoading) {
		fetch(settings.apiroot + "get_dash_data", reqOpts)
			.then(response => response.json())
			.then(result => {
				console.log(result.upcoming_exams);
				setUserData(result.upcoming_exams);
				setIsLoading(false);
			})
			.catch(error => toast.error('error', error));
	}

	return (
		<table className="w-full table-auto border-collapse">
			<Toaster />
			<thead className="bg-gray-100 text-gray-700">
				<tr>
					<th className="px-6 py-4 text-left font-medium">#</th>
					<th className="px-6 py-4 text-left font-medium">Exams</th>
					<th className="px-6 py-4 text-left font-medium">Date</th>
					<th className="px-6 py-4 text-left font-medium">Time</th>
					<th className="px-6 py-4 text-left font-medium">Duration</th>
					{settings.type === "student" || settings.type === "dual" ?
						<th className="px-6 py-4 text-center font-medium">Start Exam</th>
						: null}
					{settings.type === "teacher" || settings.type === "dual" ?
						<th className="px-6 py-4 text-center font-medium">Get Exam ID</th>
						: null}
				</tr>
			</thead>
			<tbody>
				{userData ? userData.map((exam, index) => (
					<tr key={index} className="border-b hover:bg-gray-50 transition">
						<td className="px-6 py-4">{index + 1}</td>
						<td className="px-6 py-4">{exam ? exam.Name : null}</td>
						<td className="px-6 py-4">{exam ? exam.datetime.split(" ")[0] : null}</td>
						<td className="px-6 py-4">{exam ? exam.datetime.split(" ")[1].split("+")[0] : null}</td>
						<td className="px-6 py-4">{SecToText(exam ? exam.duration : null)}</td>
						{settings.type === "student" || settings.type === "dual" ?
							<td className="px-6 py-4 text-center">
								<Link href={"/Exam/Attempt/" + exam.id} className="text-blue-500 hover:text-blue-700 transition">Open</Link>
							</td>
							:
							null
						}
						{settings.type === "teacher" || settings.type === "dual" ?
							<td className="px-6 py-4 text-center">
								<Button as={Link} onClick={() => {
									navigator.clipboard.writeText(exam.id).then(() => {
										toast.success("Successfully copied to clipboard")
									}).catch(() => {
										toast.error("Failed to copy to clipboard")
									})
								}} className="text-blue-500 hover:text-blue-700 transition">
									Get it
								</Button>
							</td>
							:
							null
						}
					</tr>
				)) : null}
			</tbody>
		</table>
	);
}

export default ExamTT;