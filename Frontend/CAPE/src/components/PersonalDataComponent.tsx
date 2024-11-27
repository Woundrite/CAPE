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
		// body: JSON.stringify({
		// 	"attempt_id": 1,
		// })
	}

	const [userData, setUserData] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	// const [upcoming, setUpcoming] = useState(null);
	// /*

	// */
	// useEffect(() => {
	// 	setUpcoming();

	// 	setIsLoading(false);
	// }, [userData]);

	if (Object.keys(userData).length === 0 && isLoading) {
		fetch(settings.apiroot + "get_dash_data", reqOpts)
			.then(response => response.json())
			.then(result => {
				setUserData(result);
				setIsLoading(false);
			})
			.catch(error => toast.error('error', error));
	}


	return (
		<Skeleton isLoaded={!isLoading}>
			<Card className="grid grid-cols-2 gap-4 mb-8">
				<div className="bg-white shadow-md rounded-xl p-6 h-full">
					<h2 className="text-lg font-semibold text-gray-700 mb-4">Student Information</h2>
					<p className="text-gray-600 mb-2"><strong>Name:</strong> {settings.username}</p>
					<p className="text-gray-600 mb-2"><strong>Email:</strong> {settings.email}</p>
					<p className="text-gray-600 mb-2"><strong>Exams Attempted:</strong>{userData.exams_attempted}</p>
					<p className="text-gray-600 mb-2"><strong>Average Score:</strong> {userData.average_score}%</p>
				</div>
				<div className="bg-white shadow-md rounded-xl p-6">
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

// {
// 	"user_type": "dual",
// 		"username": "Nikhil",
// 			"email": "ndbendale2004@gmail.com",
// 				"correct": 1,
// 					"wrong": 1,
// 						"exams_attempted": 1,
// 							"average_score": 50,
// 								"upcoming_exams": [
// 									{
// 										"Name": "Test_upcoming",
// 										"id": "7aeacc4c-7978-4124-82af-de2f04151ab8",
// 										"attempts": 1,
// 										"datetime": "2024-12-26 12:57:06+00:00",
// 										"duration": "1800.0"
// 									}
// 								],
// 									"past_exams": [
// 										{
// 											"Name": "Testing Exam",
// 											"id": "acd9b568-6b92-4141-b6da-02a495cf78ce",
// 											"attempts": 1,
// 											"datetime": "2024-11-25 08:44:13+00:00",
// 											"duration": "1800.0"
// 										}
// 									]
// }
export default PersonalDataComponent;