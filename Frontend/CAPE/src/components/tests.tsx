import React from "react";
import { Card, CardBody, Badge, Link, Skeleton, Button } from "@nextui-org/react";

import SidebarAnalytics from "./SidebarAnalytics.tsx";
import { useDisclosure } from "@nextui-org/react";
import { userSettings } from '../store.ts';
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react'
import Drawer from "./Drawer.tsx";

import { toast } from 'react-hot-toast';


const TestCards = () => {
	const [isLoading, setIsLoading] = useState(true);

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

	const [examData, setExamData] = useState([]);

	if (Object.keys(examData).length === 0 && isLoading) {
		fetch(settings.apiroot + "get_dash_data", reqOpts)
			.then(response => response.json())
			.then(result => {
				setExamData(result.past_exams);
				setIsLoading(false)
			})
			.catch(error => toast.error('error', error));
	}

	return (
		<Skeleton isLoaded={!isLoading}>
			<Card className="p-6">
				<p className="text-xl mb-4 font-semibold">Tests:</p>
				<div className="grid grid-cols-4 gap-4">
					{examData ?
						examData.map((test, index) => (
							<Drawer key={index} key={index} id={test.id} onClose={() => setIsDrawerOpen(false)} title={test.Name} trigger={
								<Card shadow={"none"} bordered className="h-auto shadow-medium border-2 bg-white">
									<CardBody key={index} className="grid grid-cols-[1fr_3fr] justify-left items-center">
										<div></div>
										<div>
											<p className="text-xl">{test.Name}</p>
											<p >{test.average_score}%</p>
										</div>
									</CardBody>
								</Card>
							}>
								<SidebarAnalytics />
							</Drawer>
						)) : null
					}
				</div>
			</Card>
		</Skeleton>
	);
};

export default TestCards;