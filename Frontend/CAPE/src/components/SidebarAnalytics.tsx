import { useState } from "react";
import { Card, Button, Badge, } from "@nextui-org/react";
import Chart from "react-apexcharts";

const SidebarAnalytics = () => {
	const [chartData] = useState({
		series: [60], // Represents the percentage
		options: {
			chart: {
				height: 200,
				type: "radialBar",
			},
			plotOptions: {
				radialBar: {
					hollow: {
						size: "70%",
					},
					dataLabels: {
						name: {
							show: false,
						},
						value: {
							fontSize: "24px",
							color: "#000",
						},
					},
				},
			},
			labels: ["Average Marks"],
			colors: ["#6C63FF"],
		},
	});

	return (
		<div className="p-4 space-y-6 bg-white rounded-lg shadow-md">
			{/* Average Marks Section */}
			<Card shadow={"none"} className="p-4">
				<div className="flex justify-between items-center mb-2">
					<h4 className="font-bold">
						Average Marks
					</h4>
				</div>
				<Chart options={chartData.options} series={chartData.series} type="radialBar" height={200} />
			</Card>

			{/* Students Attempted Section */}
			<Card shadow={"none"} className="p-4 space-y-4">
				<h4 className="font-bold">
					Students Attempted
				</h4>
				<div className="space-y-2">
					<div className="w-full bg-yellow-400 flex justify-between items-center p-4 rounded">
						<p className="font-bold text-black">
							60
						</p>
						<p className="text-black font-bold">Students attempted</p>
					</div>
					<div color="warning" className="w-full flex bg-blue-400 justify-between items-center p-4 rounded">
						<p className="font-bold text-black ">
							40
						</p>
						<p className="text-black font-bold">Students didn’t attempt</p>
					</div>
				</div>
			</Card>

			{/* Test Details */}
			<Card shadow={false} bordered className="p-4">
				<div className="flex justify-between items-center">
					<h5 className="font-bold">
						Test 1
					</h5>
					<Badge color="primary" size="sm">
						1st
					</Badge>
				</div>
				<p className="text-gray-500">
					11.69 m
				</p>
			</Card>
		</div>
	);
};

export default SidebarAnalytics;
