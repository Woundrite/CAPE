import { useStore } from '@nanostores/react'
import { userSettings } from '../store.ts';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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

	if (Object.keys(userData).length === 0 && isLoading) {
		fetch(settings.apiroot + "get_dash_data", reqOpts)
			.then(response => response.json())
			.then(result => {
				useState(Array([result.upcoming_exams]));
				setIsLoading(false);
			})
			.catch(error => toast.error('error', error));
	}

	return (
		<table className="w-full table-auto border-collapse">
			<thead className="bg-gray-100 text-gray-700">
				<tr>
					<th className="px-6 py-4 text-left font-medium">#</th>
					<th className="px-6 py-4 text-left font-medium">Exams</th>
					<th className="px-6 py-4 text-left font-medium">Date</th>
					<th className="px-6 py-4 text-left font-medium">Duration</th>
					<th className="px-6 py-4 text-center font-medium">Action</th>
				</tr>
			</thead>
			<tbody>
				{userData ? userData.map((exam, index) => (
					<tr key={index} className="border-b hover:bg-gray-50 transition">
						<td className="px-6 py-4">{index + 1}</td>
						<td className="px-6 py-4">{exam.Name}</td>
						<td className="px-6 py-4">{exam.datetime}</td>
						<td className="px-6 py-4">{exam.duration}</td>
						<td className="px-6 py-4 text-center">
							<button className="text-blue-500 hover:text-blue-700 transition">Open</button>
						</td>
					</tr>
				)) : null}
			</tbody>
		</table>
	);
}

export default ExamTT;