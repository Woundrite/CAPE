import { useStore } from '@nanostores/react'
import { userSettings } from '../store.ts';
import { Card, Skeleton, Button, Link } from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

const PersonalDataComponent = () => {
	const settings = useStore(userSettings);

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

	const [userData, setUserData] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	if (Object.keys(userData).length === 0 && isLoading) {
		fetch(settings.apiroot + "get_dash_data", reqOpts)
			.then(response => response.json())
			.then(result => {
				console.log(result)
				setUserData(result);
				setIsLoading(false);
			})
			.catch(error => toast.error('error', error));
	}


	return (
		<Skeleton isLoaded={!isLoading}>
			<Card className="grid grid-cols-2 gap-4 mb-8">
				<div className="bg-white border-r-2 border-gray-500 rounded-l-xl p-6 h-full">
					<h2 className="text-lg font-semibold text-gray-700 mb-4">Student Information</h2>
					<p className="text-gray-600 mb-2"><strong>Name:</strong> {settings.username}</p>
					<p className="text-gray-600 mb-2"><strong>Email:</strong> {settings.email}</p>
					<p className="text-gray-600 mb-2"><strong>Exams Attempted:</strong>{userData.exams_attempted}</p>
					<p className="text-gray-600 mb-2"><strong>Average Score:</strong> {userData.average_score}%</p>
				</div>
				<div className="bg-white rounded-xl p-6">
					<h2 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Exams</h2>
					<ul className="list-disc pl-5 mb-4">
						{userData.upcoming_exams ? userData.upcoming_exams.map((exam, i) => (
							<li key={i}><Link  href={exam.id} className="mb-2 text-black">{exam.Name} - {exam.datetime}</Link>
							</li>)) : null}
					</ul>
					<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
						<p className="font-semibold text-yellow-700">Messages:</p>
						<p className="text-yellow-600">Remember to review your materials before the upcoming exams!</p>
					</div>
				</div>
			</Card >
		</Skeleton >
	);

}

export default PersonalDataComponent;