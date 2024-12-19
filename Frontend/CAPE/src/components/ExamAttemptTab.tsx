import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import { Input, Button, useModal, Textarea, DateRangePicker } from "@nextui-org/react";
import { parseZonedDateTime } from "@internationalized/date";
import { userSettings } from '../store.ts';
import { useStore } from '@nanostores/react'
import toast, { Toaster } from 'react-hot-toast';
import Webcam from "react-webcam";
import WebShot from "./WebShots.ts";

interface ExamIDProps {
	ID: string;
}

const ExamAttemptTab = ({ ID }: ExamIDProps) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [currentQuestion, setCurrentQuestion] = useState<number>(1);
	const [date, setDate] = useState({
		start: parseZonedDateTime("2024-12-01T00:45[Asia/Kolkata]"),
		end: parseZonedDateTime("2024-12-01T00:45[Asia/Kolkata]"),
	});

	const [questionIndex, setQuestionIndex] = useState(100);

	const settings = useStore(userSettings);

	let header = new Headers({
		"Content-Type": "application/json",
		"Authorization": "Token " + settings.authtoken,
		'Access-Control-Allow-Origin': 'http://localhost:8000',
		'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
	});
	let ExamID = ID;
	const [settingsModalVisible, setSettingsModalVisible] = useState(false);

	const openSettings = () => { setSettingsModalVisible(true); }
	const closeSettings = () => { setSettingsModalVisible(false); }

	const [selected, setSelected] = useState(100);
	const [examName, setExamName] = useState("Exam Name");
	const [examTeacher, setExamTeacher] = useState("Name");
	const [examDuration, setExamDuration] = useState(1800);
	const [duration, setDuration] = useState(1800);
	interface Question {
		ID: number;
		text: string;
		options: { ID: number; text: string }[];
	}

	const [QuestArr, setQuestArr] = useState<Question[]>([]);
	const [correct, setCorrect] = useState<(number | null)[]>(Array.from({ length: 100 }, () => null));
	const [isLoaded, setIsLoaded] = useState(false);
	const [feedback, setFeedback] = useState("");

	const SecToText = (time: number) => {
		if (time < 60)
			return "00:00:" + ("00" + String(time)).slice(2);
		else if (time < 3600)
			return "00:" + ("00" + String(Math.floor(time / 60))).slice(2) + ":" + ("00" + String(time % 60)).slice(2);
		else
			return ("00" + String(Math.floor(time / 3600))).slice(2) + ":" + ("00" + String(Math.floor(time % 3600 / 60))).slice(2) + ":" + ("00" + String(time % 60)).slice(2);
	}

	const Submit = () => {
		let opt_array = [];


		opt_array = correct.map((cor, index) => { return QuestArr[index]?.options[cor] ? QuestArr[index].options[cor].ID : -1 });

		let context = {
			"ExamID": ExamID,
			"options": opt_array,
			"feedback": feedback,
			"duration": SecToText(examDuration),
			"cheats": cheats
		}
		let reqOpts = {
			method: "POST",
			headers: header,
			body: JSON.stringify(context)
		}
		fetch(settings.apiroot + "attempt_test", reqOpts)
			.then(response => response.json())
			.then(result => {
				window.location.href = "/profile/Exams"
			})
			.catch(error => toast.error('error', error));

		closeSettings();

	}

	if (!isLoaded) {
		let context = {
			"ID": ExamID,
		}
		let reqOpts = {
			method: "POST",
			headers: header,
			body: JSON.stringify(context)
		}

		fetch(settings.apiroot + "get_test_details", reqOpts)
			.then(response => response.json())
			.then(result => {
				console.log(result);
				setExamName(result.Name);
				setExamTeacher(result.Teacher);
				setQuestArr(result.Questions);
				setExamDuration(Number(result.Duration));
				setQuestionIndex(result.Questions.length);
				setCorrect(Array.from({ length: result.Questions.length }, () => (null)))
				setDuration(Number(result.Duration));
				setIsLoaded(true);
				
			})
			.catch(error => toast.error('error', error));
	}

	const webcamRef = useRef(null);
	const [imgSrc, setImgSrc] = useState(null);
	const [cheats, setCheats] = useState(0);


  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
	let context = {
		"Image": imageSrc,
	}
	let reqOpts = {
		method: "POST",
		headers: header,
		body: JSON.stringify(context)
	}
	fetch(settings.apiroot + "check_image", reqOpts)
			.then(response => response.json())
			.then(result => {
				console.log(cheats, result)
				if(result.verdict == true){
					setCheats(cheats+1);
				}
			})
    setImgSrc(imageSrc);
  };

	useEffect(() => {
		let ExamTimerDurationID = setInterval(() => {
			if (duration == 0) {
				Submit();
			} else {
				capture();
			
				setDuration(duration - 1);
			}
		}, 1000);

		//Clearing the interval
		return () => clearInterval(ExamTimerDurationID);
	}, [duration]);

	const handleQuestionChange = (
		field: string,
		value: string | number,
		optionIndex?: number
	) => {
		if (field == "answer") {
			let cor = correct.map((cor, index) => index == currentQuestion - 1 ? Number(value) : cor);
			setCorrect(cor);
		}
	};

	const videoConstraints = {
		width: 1280,
		height: 720,
		facingMode: "user"
	};

	const preventRefresh = (e: BeforeUnloadEvent): string => {
		e.preventDefault();
		return "data will get lost";
	};

	useEffect(() => {
		window.addEventListener('beforeunload', preventRefresh);

		return () => {
			window.removeEventListener('beforeunload', preventRefresh);
		}
	}, [])

	let handleNumberChange = (value: number) => {
		setCurrentQuestion(
			Math.min(
				questionIndex,
				Math.max(1, Number(value))
			)
		)
	}

	return (
		<div>
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
									<Textarea
										type="duration"
										label="Feedback"
										labelPlacement="outside"
										description="Exam Feedback"
										value={feedback}
										onValueChange={setFeedback}
									/>
								</div>
							</ModalBody>
							<ModalFooter>
								{duration == 0 ? null :
									<Button color="danger" onPress={onClose}>
										Close
									</Button>
								}
								{duration == 0 ? <Button color="primary" onPress={onClose}>
									Save
								</Button> :
									<Button color="primary" onPress={Submit}>
										Save
									</Button>
								}
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
						{/* Settings Icon
						<Button
							onPress={onOpen}
							className="p-2 rounded-full hover:bg-gray-200"
							title="Settings"
						>
							ℹ
						</Button> */}
					</div>
					<div className="grid grid-cols-4 gap-2">
						{QuestArr.map((_, index) => (
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
				<div className="flex-1 h-full bg-white shadow overflow-hidden rounded-lg p-6 ml-4">
					<h2 className="text-lg font-semibold text-right">{SecToText(duration)}</h2>
					<div className="flex items-center my-4">
						<span className="text-gray-700">Go to Question:</span>
						<Input
							type="number"
							value={String(currentQuestion)}
							onChange={(e) =>
								handleNumberChange(Number(e.target.value))
							}
							className="ml-2 max-w-[70px]"
						/>
						<span className="ml-2">/ {questionIndex}</span>
					</div>
					<Webcam
        muted={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
					{/* Question Input */}
					<div className="mb-4">
						<div className="text-lg font-semibold"
						> {QuestArr[currentQuestion - 1] ? QuestArr[currentQuestion - 1].text : ""} </div>
					</div>

					{/* Options Inputs */}
					{QuestArr[currentQuestion - 1] ? QuestArr[currentQuestion - 1].options.map((option, idx) => (
						<div key={idx} className="flex items-center gap-2 mb-3">
							<input
								type="radio"
								name={`answer-${currentQuestion}`}
								checked={correct[currentQuestion - 1] === idx}
								onChange={() => handleQuestionChange("answer", idx)}
								className="w-5 h-5"
							/>
							<div
							>{option.text}</div>
						</div>
					))
						:
						[{ "ID": 0, "text": "" }, { "ID": 0, "text": "" }, { "ID": 0, "text": "" }, { "ID": 0, "text": "" }].map((option, idx) => (
							<div key={idx} className="flex items-center gap-2 mb-3">
								<input
									type="radio"
									name={`answer-${currentQuestion}`}
									// checked={correct[currentQuestion - 1] === idx}
									onChange={() => handleQuestionChange("answer", idx)}
									className="w-5 h-5"
								/>
								<div
								>{option.text}</div>
							</div>
						))}




					{/* Navigation Buttons */}
					<div className="flex justify-between mt-6">
						{currentQuestion == 1 ?
							null :

							<Button
								disabled={currentQuestion === 1}
								onClick={() => setCurrentQuestion(currentQuestion - 1)}
							>
								Previous
							</Button>
						}
						{currentQuestion == QuestArr.length ?
							<Button color="success" onClick={onOpen}>
								Submit
							</Button> :
							<Button
								color="primary"
								disabled={currentQuestion === questionIndex}
								onClick={() => setCurrentQuestion(currentQuestion + 1)}
							>
								Next
							</Button>}
					</div>
				</div>

			</div>
		</div>
	);
};

export default ExamAttemptTab;
