import Chart from "react-apexcharts";
import { Card, CardBody, Skeleton } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react'
import { userSettings } from '../store.ts';
import { toast } from 'react-hot-toast';

const Statistics = () => {
	const settings = useStore(userSettings);
	const [isLoading, setIsLoading] = useState(true);
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
	// {
	// 	"user_type": "dual",
	// 		"username": "Nikhil",
	// 			"email": "ndbendale2004@gmail.com",
	// 				"correct": 1,
	// 					"wrong": 1,
	// 						"exams_attempted": 2,
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
	// 											"duration": "1800.0",
	// 											"average_score": 50
	// 										}
	// 									]
	// }
	const [chartData, setChartData] = useState({});

	if (Object.keys(chartData).length === 0 && isLoading) {
		fetch(settings.apiroot + "get_dash_data", reqOpts)
			.then(response => response.json())
			.then(result => {
				let avgData: string[] = [];
				let corrData: string[] = [];
				let wrongData: string[] = [];
				let nameData: string[] = [];
				Array.prototype.forEach.call(result.past_exams, (pExam) => {
					nameData.push(pExam.Name);
					avgData.push(pExam.average_score);
					corrData.push(pExam.correct);
					wrongData.push(pExam.wrong);
				});

				let chartedData = {
					series: [
						{
							name: "Average Score",
							data: avgData,
						},
						{
							name: "Correct Answers",
							data: corrData,
						},
						{
							name: "Wrong Answers",
							data: wrongData,
						},
					],
					options: {
						chart: {
							type: "area",
							height: 350,
							toolbar: {
								show: true,
							},
						},
						dataLabels: {
							enabled: true,
						},
						stroke: {
							curve: "smooth",
						},
						xaxis: {
							categories: nameData,
						},
						colors: ["#6C63FF", "#E14764", "#141414"], // Custom color for the chart
						fill: {
							type: "gradient",
							gradient: {
								shadeIntensity: 1,
								opacityFrom: 0.8,
								opacityTo: 0.5,
								stops: [0, 90, 100],
							},
						},
						tooltip: {
							x: {
								format: "MMM", window
							},
						},
					},
				}
				setChartData(chartedData);
				setIsLoading(false);
			})
			.catch(error => toast.error('error', error));
	}

	// setIsLoading(false);

	return (
		<Skeleton isLoaded={!isLoading}>
		<Card shadow={"none"} className="mb-8" bordered>
			<CardBody>
				<h1 className="m-4 text-3xl font-bold">
					Statistics
				</h1>
				<div className="h-64">
					{(!isLoading) ? <Chart
						options={chartData.options}
						series={chartData.series}
						type="area"
						height="100%"
					/> : null}
				</div>
			</CardBody>
		</Card>
		</Skeleton>
	);
};

export default Statistics;
