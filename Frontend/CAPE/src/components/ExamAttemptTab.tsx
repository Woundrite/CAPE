import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { Input, Button, useModal, Textarea, DateRangePicker } from "@nextui-org/react";
import { parseZonedDateTime } from "@internationalized/date";
import { userSettings } from '../store.ts';
import { useStore } from '@nanostores/react'
import toast, { Toaster } from 'react-hot-toast';
import Webcam from "react-webcam";

const ExamAttemptTab = (ID: string) => {
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


	const [settingsModalVisible, setSettingsModalVisible] = useState(false);

	// Toggle the modal
	let ExamID = ID.ID;
	const openSettings = () => { setSettingsModalVisible(true); }
	const closeSettings = () => { setSettingsModalVisible(false); }

	const [selected, setSelected] = useState(100);
	const [examName, setExamName] = useState("Exam Name");
	const [examTeacher, setExamTeacher] = useState("Name");
	const [examDuration, setExamDuration] = useState(1800);
	const [duration, setDuration] = useState(1800);
	const [QuestArr, setQuestArr] = useState([]);
	const [correct, setCorrect] = useState(Array.from({ length: 100 }, () => (null)));
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


		opt_array = correct.map((cor, index) => { return QuestArr[index].options[cor] ? QuestArr[index].options[cor].ID : -1 });

		let context = {
			"ExamID": ExamID,
			"options": opt_array,
			"feedback": feedback,
			"duration": SecToText(examDuration),
		}
		let reqOpts = {
			method: "POST",
			headers: header,
			body: JSON.stringify(context)
		}
		fetch(settings.apiroot + "attempt_test", reqOpts)
			.then(response => response.json())
			.then(result => {
				window.location = "/profile/Exams"
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

	useEffect(() => {
		let ExamTimerDurationID = setInterval(() => {
			if (duration == 0) {
				Submit();
			} else {
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

	const preventRefresh = (e) => {
		e.preventDefault()
		return "data will get lost"
	};

	useEffect(() => {
		window.addEventListener('beforeunload', preventRefresh);

		return () => {
			window.removeEventListener('beforeunload', preventRefresh);
		}
	}, [])

	const webcamRef = React.useRef(null);
	const capture = () => {
		function dataURIToBlob(dataURI: string) {
			dataURI = dataURI.replace(/^data:/, '');

			const type = dataURI.match(/image\/[^;]+/)[0];
			const base64 = dataURI.replace(/^[^,]+,/, '');
			const arrayBuffer = new ArrayBuffer(base64.length);
			const typedArray = new Uint8Array(arrayBuffer);

			for (let i = 0; i < base64.length; i++) {
				typedArray[i] = base64.charCodeAt(i);
			}

			return new Blob([arrayBuffer], { type });
		}
		if (webcamRef) {
			if (webcamRef.current) {
				const imageSrc = webcamRef.current.getScreenshot();
				if (imageSrc != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtAAAAGVCAYAAADXKsbeAAAAAXNSR0IArs4c6QAAF15JREFUeF7t1rENACAMBLFk/6FBYgKud+pU1he3M3PGESBAgAABAgQIECDwJbAC+svJEwECBAgQIECAAIEnIKANgQABAgQIECBAgEAQENAByysBAgQIECBAgAABAW0DBAgQIECAAAECBIKAgA5YXgkQIECAAAECBAgIaBsgQIAAAQIECBAgEAQEdMDySoAAAQIECBAgQEBA2wABAgQIECBAgACBICCgA5ZXAgQIECBAgAABAgLaBggQIECAAAECBAgEAQEdsLwSIECAAAECBAgQENA2QIAAAQIECBAgQCAICOiA5ZUAAQIECBAgQICAgLYBAgQIECBAgAABAkFAQAcsrwQIECBAgAABAgQEtA0QIECAAAECBAgQCAICOmB5JUCAAAECBAgQICCgbYAAAQIECBAgQIBAEBDQAcsrAQIECBAgQIAAAQFtAwQIECBAgAABAgSCgIAOWF4JECBAgAABAgQICGgbIECAAAECBAgQIBAEBHTA8kqAAAECBAgQIEBAQNsAAQIECBAgQIAAgSAgoAOWVwIECBAgQIAAAQIC2gYIECBAgAABAgQIBAEBHbC8EiBAgAABAgQIEBDQNkCAAAECBAgQIEAgCAjogOWVAAECBAgQIECAgIC2AQIECBAgQIAAAQJBQEAHLK8ECBAgQIAAAQIEBLQNECBAgAABAgQIEAgCAjpgeSVAgAABAgQIECAgoG2AAAECBAgQIECAQBAQ0AHLKwECBAgQIECAAAEBbQMECBAgQIAAAQIEgoCADlheCRAgQIAAAQIECAhoGyBAgAABAgQIECAQBAR0wPJKgAABAgQIECBAQEDbAAECBAgQIECAAIEgIKADllcCBAgQIECAAAECAtoGCBAgQIAAAQIECAQBAR2wvBIgQIAAAQIECBAQ0DZAgAABAgQIECBAIAgI6IDllQABAgQIECBAgICAtgECBAgQIECAAAECQUBAByyvBAgQIECAAAECBAS0DRAgQIAAAQIECBAIAgI6YHklQIAAAQIECBAgIKBtgAABAgQIECBAgEAQENAByysBAgQIECBAgAABAW0DBAgQIECAAAECBIKAgA5YXgkQIECAAAECBAgIaBsgQIAAAQIECBAgEAQEdMDySoAAAQIECBAgQEBA2wABAgQIECBAgACBICCgA5ZXAgQIECBAgAABAgLaBggQIECAAAECBAgEAQEdsLwSIECAAAECBAgQENA2QIAAAQIECBAgQCAICOiA5ZUAAQIECBAgQICAgLYBAgQIECBAgAABAkFAQAcsrwQIECBAgAABAgQEtA0QIECAAAECBAgQCAICOmB5JUCAAAECBAgQICCgbYAAAQIECBAgQIBAEBDQAcsrAQIECBAgQIAAAQFtAwQIECBAgAABAgSCgIAOWF4JECBAgAABAgQICGgbIECAAAECBAgQIBAEBHTA8kqAAAECBAgQIEBAQNsAAQIECBAgQIAAgSAgoAOWVwIECBAgQIAAAQIC2gYIECBAgAABAgQIBAEBHbC8EiBAgAABAgQIEBDQNkCAAAECBAgQIEAgCAjogOWVAAECBAgQIECAgIC2AQIECBAgQIAAAQJBQEAHLK8ECBAgQIAAAQIEBLQNECBAgAABAgQIEAgCAjpgeSVAgAABAgQIECAgoG2AAAECBAgQIECAQBAQ0AHLKwECBAgQIECAAAEBbQMECBAgQIAAAQIEgoCADlheCRAgQIAAAQIECAhoGyBAgAABAgQIECAQBAR0wPJKgAABAgQIECBAQEDbAAECBAgQIECAAIEgIKADllcCBAgQIECAAAECAtoGCBAgQIAAAQIECAQBAR2wvBIgQIAAAQIECBAQ0DZAgAABAgQIECBAIAgI6IDllQABAgQIECBAgICAtgECBAgQIECAAAECQUBAByyvBAgQIECAAAECBAS0DRAgQIAAAQIECBAIAgI6YHklQIAAAQIECBAgIKBtgAABAgQIECBAgEAQENAByysBAgQIECBAgAABAW0DBAgQIECAAAECBIKAgA5YXgkQIECAAAECBAgIaBsgQIAAAQIECBAgEAQEdMDySoAAAQIECBAgQEBA2wABAgQIECBAgACBICCgA5ZXAgQIECBAgAABAgLaBggQIECAAAECBAgEAQEdsLwSIECAAAECBAgQENA2QIAAAQIECBAgQCAICOiA5ZUAAQIECBAgQICAgLYBAgQIECBAgAABAkFAQAcsrwQIECBAgAABAgQEtA0QIECAAAECBAgQCAICOmB5JUCAAAECBAgQICCgbYAAAQIECBAgQIBAEBDQAcsrAQIECBAgQIAAAQFtAwQIECBAgAABAgSCgIAOWF4JECBAgAABAgQICGgbIECAAAECBAgQIBAEBHTA8kqAAAECBAgQIEBAQNsAAQIECBAgQIAAgSAgoAOWVwIECBAgQIAAAQIC2gYIECBAgAABAgQIBAEBHbC8EiBAgAABAgQIEBDQNkCAAAECBAgQIEAgCAjogOWVAAECBAgQIECAgIC2AQIECBAgQIAAAQJBQEAHLK8ECBAgQIAAAQIEBLQNECBAgAABAgQIEAgCAjpgeSVAgAABAgQIECAgoG2AAAECBAgQIECAQBAQ0AHLKwECBAgQIECAAAEBbQMECBAgQIAAAQIEgoCADlheCRAgQIAAAQIECAhoGyBAgAABAgQIECAQBAR0wPJKgAABAgQIECBAQEDbAAECBAgQIECAAIEgIKADllcCBAgQIECAAAECAtoGCBAgQIAAAQIECAQBAR2wvBIgQIAAAQIECBAQ0DZAgAABAgQIECBAIAgI6IDllQABAgQIECBAgICAtgECBAgQIECAAAECQUBAByyvBAgQIECAAAECBAS0DRAgQIAAAQIECBAIAgI6YHklQIAAAQIECBAgIKBtgAABAgQIECBAgEAQENAByysBAgQIECBAgAABAW0DBAgQIECAAAECBIKAgA5YXgkQIECAAAECBAgIaBsgQIAAAQIECBAgEAQEdMDySoAAAQIECBAgQEBA2wABAgQIECBAgACBICCgA5ZXAgQIECBAgAABAgLaBggQIECAAAECBAgEAQEdsLwSIECAAAECBAgQENA2QIAAAQIECBAgQCAICOiA5ZUAAQIECBAgQICAgLYBAgQIECBAgAABAkFAQAcsrwQIECBAgAABAgQEtA0QIECAAAECBAgQCAICOmB5JUCAAAECBAgQICCgbYAAAQIECBAgQIBAEBDQAcsrAQIECBAgQIAAAQFtAwQIECBAgAABAgSCgIAOWF4JECBAgAABAgQICGgbIECAAAECBAgQIBAEBHTA8kqAAAECBAgQIEBAQNsAAQIECBAgQIAAgSAgoAOWVwIECBAgQIAAAQIC2gYIECBAgAABAgQIBAEBHbC8EiBAgAABAgQIEBDQNkCAAAECBAgQIEAgCAjogOWVAAECBAgQIECAgIC2AQIECBAgQIAAAQJBQEAHLK8ECBAgQIAAAQIEBLQNECBAgAABAgQIEAgCAjpgeSVAgAABAgQIECAgoG2AAAECBAgQIECAQBAQ0AHLKwECBAgQIECAAAEBbQMECBAgQIAAAQIEgoCADlheCRAgQIAAAQIECAhoGyBAgAABAgQIECAQBAR0wPJKgAABAgQIECBAQEDbAAECBAgQIECAAIEgIKADllcCBAgQIECAAAECAtoGCBAgQIAAAQIECAQBAR2wvBIgQIAAAQIECBAQ0DZAgAABAgQIECBAIAgI6IDllQABAgQIECBAgICAtgECBAgQIECAAAECQUBAByyvBAgQIECAAAECBAS0DRAgQIAAAQIECBAIAgI6YHklQIAAAQIECBAgIKBtgAABAgQIECBAgEAQENAByysBAgQIECBAgAABAW0DBAgQIECAAAECBIKAgA5YXgkQIECAAAECBAgIaBsgQIAAAQIECBAgEAQEdMDySoAAAQIECBAgQEBA2wABAgQIECBAgACBICCgA5ZXAgQIECBAgAABAgLaBggQIECAAAECBAgEAQEdsLwSIECAAAECBAgQENA2QIAAAQIECBAgQCAICOiA5ZUAAQIECBAgQICAgLYBAgQIECBAgAABAkFAQAcsrwQIECBAgAABAgQEtA0QIECAAAECBAgQCAICOmB5JUCAAAECBAgQICCgbYAAAQIECBAgQIBAEBDQAcsrAQIECBAgQIAAAQFtAwQIECBAgAABAgSCgIAOWF4JECBAgAABAgQICGgbIECAAAECBAgQIBAEBHTA8kqAAAECBAgQIEBAQNsAAQIECBAgQIAAgSAgoAOWVwIECBAgQIAAAQIC2gYIECBAgAABAgQIBAEBHbC8EiBAgAABAgQIEBDQNkCAAAECBAgQIEAgCAjogOWVAAECBAgQIECAgIC2AQIECBAgQIAAAQJBQEAHLK8ECBAgQIAAAQIEBLQNECBAgAABAgQIEAgCAjpgeSVAgAABAgQIECAgoG2AAAECBAgQIECAQBAQ0AHLKwECBAgQIECAAAEBbQMECBAgQIAAAQIEgoCADlheCRAgQIAAAQIECAhoGyBAgAABAgQIECAQBAR0wPJKgAABAgQIECBAQEDbAAECBAgQIECAAIEgIKADllcCBAgQIECAAAECAtoGCBAgQIAAAQIECAQBAR2wvBIgQIAAAQIECBAQ0DZAgAABAgQIECBAIAgI6IDllQABAgQIECBAgICAtgECBAgQIECAAAECQUBAByyvBAgQIECAAAECBAS0DRAgQIAAAQIECBAIAgI6YHklQIAAAQIECBAgIKBtgAABAgQIECBAgEAQENAByysBAgQIECBAgAABAW0DBAgQIECAAAECBIKAgA5YXgkQIECAAAECBAgIaBsgQIAAAQIECBAgEAQEdMDySoAAAQIECBAgQEBA2wABAgQIECBAgACBICCgA5ZXAgQIECBAgAABAgLaBggQIECAAAECBAgEAQEdsLwSIECAAAECBAgQENA2QIAAAQIECBAgQCAICOiA5ZUAAQIECBAgQICAgLYBAgQIECBAgAABAkFAQAcsrwQIECBAgAABAgQEtA0QIECAAAECBAgQCAICOmB5JUCAAAECBAgQICCgbYAAAQIECBAgQIBAEBDQAcsrAQIECBAgQIAAAQFtAwQIECBAgAABAgSCgIAOWF4JECBAgAABAgQICGgbIECAAAECBAgQIBAEBHTA8kqAAAECBAgQIEBAQNsAAQIECBAgQIAAgSAgoAOWVwIECBAgQIAAAQIC2gYIECBAgAABAgQIBAEBHbC8EiBAgAABAgQIEBDQNkCAAAECBAgQIEAgCAjogOWVAAECBAgQIECAgIC2AQIECBAgQIAAAQJBQEAHLK8ECBAgQIAAAQIEBLQNECBAgAABAgQIEAgCAjpgeSVAgAABAgQIECAgoG2AAAECBAgQIECAQBAQ0AHLKwECBAgQIECAAAEBbQMECBAgQIAAAQIEgoCADlheCRAgQIAAAQIECAhoGyBAgAABAgQIECAQBAR0wPJKgAABAgQIECBAQEDbAAECBAgQIECAAIEgIKADllcCBAgQIECAAAECAtoGCBAgQIAAAQIECAQBAR2wvBIgQIAAAQIECBAQ0DZAgAABAgQIECBAIAgI6IDllQABAgQIECBAgICAtgECBAgQIECAAAECQUBAByyvBAgQIECAAAECBAS0DRAgQIAAAQIECBAIAgI6YHklQIAAAQIECBAgIKBtgAABAgQIECBAgEAQENAByysBAgQIECBAgAABAW0DBAgQIECAAAECBIKAgA5YXgkQIECAAAECBAgIaBsgQIAAAQIECBAgEAQEdMDySoAAAQIECBAgQEBA2wABAgQIECBAgACBICCgA5ZXAgQIECBAgAABAgLaBggQIECAAAECBAgEAQEdsLwSIECAAAECBAgQENA2QIAAAQIECBAgQCAICOiA5ZUAAQIECBAgQICAgLYBAgQIECBAgAABAkFAQAcsrwQIECBAgAABAgQEtA0QIECAAAECBAgQCAICOmB5JUCAAAECBAgQICCgbYAAAQIECBAgQIBAEBDQAcsrAQIECBAgQIAAAQFtAwQIECBAgAABAgSCgIAOWF4JECBAgAABAgQICGgbIECAAAECBAgQIBAEBHTA8kqAAAECBAgQIEBAQNsAAQIECBAgQIAAgSAgoAOWVwIECBAgQIAAAQIC2gYIECBAgAABAgQIBAEBHbC8EiBAgAABAgQIEBDQNkCAAAECBAgQIEAgCAjogOWVAAECBAgQIECAgIC2AQIECBAgQIAAAQJBQEAHLK8ECBAgQIAAAQIEBLQNECBAgAABAgQIEAgCAjpgeSVAgAABAgQIECAgoG2AAAECBAgQIECAQBAQ0AHLKwECBAgQIECAAAEBbQMECBAgQIAAAQIEgoCADlheCRAgQIAAAQIECAhoGyBAgAABAgQIECAQBAR0wPJKgAABAgQIECBAQEDbAAECBAgQIECAAIEgIKADllcCBAgQIECAAAECAtoGCBAgQIAAAQIECAQBAR2wvBIgQIAAAQIECBAQ0DZAgAABAgQIECBAIAgI6IDllQABAgQIECBAgICAtgECBAgQIECAAAECQUBAByyvBAgQIECAAAECBAS0DRAgQIAAAQIECBAIAgI6YHklQIAAAQIECBAgIKBtgAABAgQIECBAgEAQENAByysBAgQIECBAgAABAW0DBAgQIECAAAECBIKAgA5YXgkQIECAAAECBAgIaBsgQIAAAQIECBAgEAQEdMDySoAAAQIECBAgQEBA2wABAgQIECBAgACBICCgA5ZXAgQIECBAgAABAgLaBggQIECAAAECBAgEAQEdsLwSIECAAAECBAgQENA2QIAAAQIECBAgQCAICOiA5ZUAAQIECBAgQICAgLYBAgQIECBAgAABAkFAQAcsrwQIECBAgAABAgQEtA0QIECAAAECBAgQCAICOmB5JUCAAAECBAgQICCgbYAAAQIECBAgQIBAEBDQAcsrAQIECBAgQIAAAQFtAwQIECBAgAABAgSCgIAOWF4JECBAgAABAgQICGgbIECAAAECBAgQIBAEBHTA8kqAAAECBAgQIEBAQNsAAQIECBAgQIAAgSAgoAOWVwIECBAgQIAAAQIC2gYIECBAgAABAgQIBAEBHbC8EiBAgAABAgQIEBDQNkCAAAECBAgQIEAgCAjogOWVAAECBAgQIECAgIC2AQIECBAgQIAAAQJBQEAHLK8ECBAgQIAAAQIEBLQNECBAgAABAgQIEAgCAjpgeSVAgAABAgQIECAgoG2AAAECBAgQIECAQBAQ0AHLKwECBAgQIECAAAEBbQMECBAgQIAAAQIEgoCADlheCRAgQIAAAQIECAhoGyBAgAABAgQIECAQBAR0wPJKgAABAgQIECBAQEDbAAECBAgQIECAAIEgIKADllcCBAgQIECAAAECAtoGCBAgQIAAAQIECAQBAR2wvBIgQIAAAQIECBAQ0DZAgAABAgQIECBAIAgI6IDllQABAgQIECBAgICAtgECBAgQIECAAAECQUBAByyvBAgQIECAAAECBAS0DRAgQIAAAQIECBAIAgI6YHklQIAAAQIECBAgIKBtgAABAgQIECBAgEAQENAByysBAgQIECBAgAABAW0DBAgQIECAAAECBIKAgA5YXgkQIECAAAECBAgIaBsgQIAAAQIECBAgEAQEdMDySoAAAQIECBAgQEBA2wABAgQIECBAgACBICCgA5ZXAgQIECBAgAABAgLaBggQIECAAAECBAgEAQEdsLwSIECAAAECBAgQENA2QIAAAQIECBAgQCAICOiA5ZUAAQIECBAgQICAgLYBAgQIECBAgAABAkFAQAcsrwQIECBAgAABAgQEtA0QIECAAAECBAgQCAICOmB5JUCAAAECBAgQICCgbYAAAQIECBAgQIBAEBDQAcsrAQIECBAgQIAAAQFtAwQIECBAgAABAgSCwAU5gpUQ598UEwAAAABJRU5ErkJggg==") {
					console.log(imageSrc);
				}
			}
		}
	}

	// setInterval(capture, 1000);
	capture()

	const closeButton = (
		<button role="button" aria-label="Close" className="absolute appearance-none select-none top-1 right-1 rtl:left-1 rtl:right-[unset] p-2 text-foreground-500 rounded-full hover:bg-default-100 active:bg-default-200 tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2" type="button">
			<svg aria-hidden="true" fill="none" onClick={closeSettings} focusable="false" height="1em" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="1em">
				<path d="M18 6L6 18M6 6l12 12">
				</path>
			</svg>
		</button>
	);

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
							value={currentQuestion}
							onChange={(e) =>
								handleNumberChange(Number(e.target.value))
							}
							className="ml-2 max-w-[70px]"
						/>
						<span className="ml-2">/ {questionIndex}</span>
					</div>
					<Webcam
						audio={false}
						height={1280}
						ref={webcamRef}
						screenshotFormat="image/png"
						width={720}
						videoConstraints={videoConstraints}
						className="left-[-10000px] top-[-10000px] absolute"
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
								auto
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
