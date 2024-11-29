import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import React, { useState } from "react";
import { Input, Button, useModal, DatePicker, DateRangePicker } from "@nextui-org/react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { userSettings } from '../store.ts';
import { useStore } from '@nanostores/react'
import toast, { Toaster } from 'react-hot-toast';
// Define the structure of a question
interface Question {
	question: string;
	options: string[];
	answer: number | null; // Index of the correct answer or null if not selected
}

const ExamTab = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [currentQuestion, setCurrentQuestion] = useState<number>(1);
	const [date, setDate] = React.useState({
		start: parseAbsoluteToLocal("2024-04-01T18:45:22Z"),
		end: parseAbsoluteToLocal("2024-04-08T19:15:22Z"),
	});

	const settings = useStore(userSettings);
	const [questions, setQuestions] = useState<Question[]>(
		Array.from({ length: 100 }, () => ({ question: "", options: ["", "", "", ""], answer: null }))
	);

	let header = new Headers({
		"Content-Type": "application/json",
		"Authorization": "Token " + settings.authtoken,
		'Access-Control-Allow-Origin': 'http://localhost:8000',
		'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
	});


	const [settingsModalVisible, setSettingsModalVisible] = useState(false);

	// Toggle the modal
	const openSettings = () => { console.log(settingsModalVisible); setSettingsModalVisible(true); }
	const closeSettings = () => { console.log(settingsModalVisible); setSettingsModalVisible(false); }

	const [questionIndex, setQuestionIndex] = useState(100);
	const [examName, setExamName] = useState("");
	const [duration, setDuration] = useState("");

	const createOpts = (qid: string, opts: any, correct: number) => {
		let id_arr: string[] = [];

		for (let i = 0; i < opts.length; i++) {
			if (i == correct) {
				opts[i] = { "quest": qid, "text": opts[i], "is_correct": true }
			}
			else {
				opts[i] = { "quest": qid, "text": opts[i], "is_correct": false }
			}
		}

		opts.forEach((opt) => {
			let reqOpts = {
				method: "POST",
				headers: header,
				body: JSON.stringify(opt)
			}

			fetch(settings.apiroot + "create_option", reqOpts)
				.then(response => response.json())
				.then(result => {
					id_arr.push(result.id);
				})
				.catch(error => toast.error('error', error));
		});

		return id_arr;


	}

	const createQuests = (quests: string) => {

		let reqOpts = {
			method: "POST",
			headers: header,
			body: JSON.stringify({
				"question": quests
			})
		}

		let id: string = "0";

		fetch(settings.apiroot + "create_question", reqOpts)
			.then(response => response.json())
			.then(result => {
				id = result.id;
			})
			.catch(error => toast.error('error', error));
		return id;
	}

	const Submit = () => {
		// Data Required:
		// num_attempts
		// questions - id
		// students -id
		// name
		// exam_start_date_time
		// exam_end_date_time
		// exam_duration

		let quest_array: string[] = [];
		let opt_array = [];

		questions.forEach((quest) => {
			let id = createQuests(quest.question)
			quest_array.push();
			opt_array.push(createOpts(id, quest.options, quest.answer ? quest.answer : 0));
		})


		let context = {
			"num_attempts": 1,
			"questions": quest_array,
			"students": [],
			"name": examName,
			"exam_start_date_time": "",
			"exam_end_date_time": "",
			"exam_duration": "",
		}

		let reqOpts = {
			method: "POST",
			headers: header,
			body: JSON.stringify(context)
		}


		// fetch(settings.apiroot + "signup", reqOpts)
		// 	.then(response => response.json())
		// 	.then(result => {
		// 	})
		// 	.catch(error => toast.error('error', error));
	}

	const handleQuestionChange = (
		field: keyof Question,
		value: string | number,
		optionIndex?: number
	) => {
		setQuestions((prev) =>
			prev.map((q, index) =>
				index === currentQuestion - 1
					? {
						...q,
						[field]:
							field === "options" && optionIndex !== undefined
								? [
									...q.options.slice(0, optionIndex),
									value as string,
									...q.options.slice(optionIndex + 1),
								]
								: value,
					}
					: q
			)
		);
	};

	const closeButton = (
		<button role="button" aria-label="Close" className="absolute appearance-none select-none top-1 right-1 rtl:left-1 rtl:right-[unset] p-2 text-foreground-500 rounded-full hover:bg-default-100 active:bg-default-200 tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2" type="button">
			<svg aria-hidden="true" fill="none" onClick={closeSettings} focusable="false" height="1em" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="1em">
				<path d="M18 6L6 18M6 6l12 12">
				</path>
			</svg>
		</button>
	);

	const handleAddOption = () => {
		setQuestions((prev) =>
			prev.map((q, index) =>
				index === currentQuestion - 1
					? {
						...q,
						options: [...q.options, ""], // Add an empty option
					}
					: q
			)
		);
	};

	let handleRemOption = () => {
		setQuestions((prev) =>
			prev.map((q, index) =>
			((index === currentQuestion - 1) && (q.options.length > 1)
				? {
					...q,
					options: [...q.options.splice(0, q.options.length - 1)], // Add an empty option
				}
				: q
			)
			)
		);
	};

	const changeExamName = (value: string) => {
		setExamName(value)
	}

	const handleLimitChange = (value: number) => {
		let len = Math.max(1, Math.min(500, value));

		if (len < questions.length) {
			let q = questions;
			q.length = len
			setQuestions([...q]);
		}
		else {
			let diff = len - questions.length;
			let arr: Question[] = Array(diff).fill({ question: "", options: ["", "", "", ""], answer: null });
			arr = [...questions].concat(arr);
			setQuestions(arr);
		}

		console.log(questions);
		setQuestionIndex(Math.max(1, Math.min(500, value)));
	};

	let handleNumberChange = (value: number) => {
		console.log(value)
		setCurrentQuestion(
			Math.min(
				questionIndex,
				Math.max(1, Number(value))
			)
		)
	}



	return (
		<>
			{/* Settings Modal */}
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				isDismissable={true}
				scrollBehavior="inside"
				isKeyboardDismissDisabled
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Exam Settings
							</ModalHeader>
							<ModalBody>
								<div className="space-y-4">
									<span>Start - End Date Time</span>
									<DateRangePicker
										fullWidth
										granularity="minute"
										label="Start - End Date Time"
										hourCycle={24}
										value={date}
										onChange={setDate}
									/>
									<span></span>
									<Input
										type="duration"
										label="Exam Duration"
										labelPlacement="outside"
										description="Exam Duration"
										value={duration}
										onValueChange={setDuration}
									/>
									<div>
										<span>Exam Name</span>
										<Input
											type="text"
											value={examName}
											onChange={(e) =>
												changeExamName(e.target.value)
											}
											className="mt-2"
										/>
									</div>
									<div>
										<span>Question Limit</span>
										<Input
											min="1" max="5"
											type="number"
											value={questionIndex}
											onChange={(e) =>
												handleLimitChange(Number(e.target.value))
											}
											className="mt-2"
										/>
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
									Save
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<div className="flex w-full h-screen bg-gray-100 p-4">
				{/* Sidebar for Question Navigation */}
				<div className="w-1/4 h-full bg-white shadow rounded-lg p-4 overflow-y-auto">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">Questions</h2>
						{/* Settings Icon */}
						<Button
							onPress={onOpen}
							className="p-2 rounded-full hover:bg-gray-200"
							title="Settings"
						>
							⚙️
						</Button>
					</div>
					<div className="grid grid-cols-4 gap-2">
						{questions.map((_, index) => (
							<button
								key={index}
								className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium ${currentQuestion === index + 1
									? "bg-blue-500 text-white"
									: "bg-gray-200 text-black"
									}`}
								onClick={() => setCurrentQuestion(index + 1)} >
								{index + 1}
							</button>
						))}
					</div>
				</div>

				{/* Question Input Section */}
				<div className="flex-1 h-full bg-white shadow rounded-lg p-6 ml-4">
					<h2 className="text-lg font-semibold">Hello Teacher</h2>
					<div className="flex items-center my-4">
						<span className="text-gray-700">Go to Question:</span>
						<Input
							type="number"
							value={currentQuestion}
							onChange={(e) =>
								handleNumberChange(Number(e.target.value))
							}
							className="ml-2 max-w-[70px]"
						/>
						<span className="ml-2">/ {questionIndex}</span>
					</div>

					{/* Question Input */}
					<div className="mb-4">
						<Input
							label="Enter Question"
							placeholder="Type your question here..."
							value={questions[currentQuestion - 1]?.question || ""}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								handleQuestionChange("question", e.target.value)
							}
							fullWidth
						/>
					</div>

					{/* Options Inputs */}
					{questions[currentQuestion - 1]?.options.map((option, idx) => (
						<div key={idx} className="flex items-center gap-2 mb-3">
							<input
								type="radio"
								name={`answer-${currentQuestion}`}
								checked={questions[currentQuestion - 1]?.answer === idx}
								onChange={() => handleQuestionChange("answer", idx)}
								className="w-5 h-5"
							/>
							<Input
								placeholder={`Enter Option ${idx + 1}`}
								value={option}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleQuestionChange("options", e.target.value, idx)
								}
								fullWidth
							/>
						</div>
					))}




					{/* Navigation Buttons */}
					<div className="flex justify-between mt-6">
						<Button
							auto
							disabled={currentQuestion === 1}
							onClick={() => setCurrentQuestion(currentQuestion - 1)}
						>
							Previous
						</Button>
						<div>
							<Button
								className="mt-2 mr-2"
								color="default"
								onClick={handleAddOption}
								disabled={questions[currentQuestion - 1]?.options.length >= 10} // Limit options to 10
							>
								Add Option
							</Button>
							<Button
								className="mt-2 ml-2"
								color="default"
								onClick={handleRemOption}
								disabled={questions[currentQuestion - 1]?.options.length >= 10} // Limit options to 10
							>
								Remove Option
							</Button>
						</div>
						{currentQuestion == questions.length ?
							<Button color="success" onClick={Submit}>
								Save Exam
							</Button> :
							<Button
								color="primary"
								disabled={currentQuestion === questionIndex.questionLimit}
								onClick={() => setCurrentQuestion(currentQuestion + 1)}
							>
								Next
							</Button>}
					</div>
				</div>

			</div>
		</>
	);
};

export default ExamTab;
