import { useStore } from '@nanostores/react'
import { userSettings } from '../store.ts';

const PersonalDataComponent = () => {
	const settings = useStore(userSettings);
	console.log(settings.username)

	return (<div className="grid grid-cols-2 gap-4 mb-8">
		<div className="bg-white shadow-md rounded-xl p-6">
			<h2 className="text-lg font-semibold text-gray-700 mb-4">Student Information</h2>
			<p className="text-gray-600 mb-2"><strong>Name:</strong> { settings.username }</p>
			<p className="text-gray-600 mb-2"><strong>Email:</strong> { settings.email }</p>
			<p className="text-gray-600 mb-2"><strong>Exams Attempted:</strong> 5</p>
			<p className="text-gray-600 mb-2"><strong>Average Score:</strong> 95%</p>
		</div>
		<div className="bg-white shadow-md rounded-xl p-6">
			<h2 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Exams</h2>
			<ul className="list-disc pl-5 mb-4">
				<li className="mb-2">Math Exam - 2023-11-10</li>
				<li className="mb-2">Science Exam - 2023-11-15</li>
				<li className="mb-2">History Exam - 2023-11-20</li>
			</ul>
			<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
				<p className="font-semibold text-yellow-700">Messages:</p>
				<p className="text-yellow-600">Remember to review your materials before the upcoming exams!</p>
			</div>
		</div>
	</div>);
}
export default PersonalDataComponent;