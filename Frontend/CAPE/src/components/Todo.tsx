import React, { useState, useEffect } from "react";
import { Input, Button, Checkbox, Card, CardBody } from "@nextui-org/react";

const TodoComponent = () => {
	const [tasks, setTasks] = useState([]);
	const [taskInput, setTaskInput] = useState("");

	// setup a local storage to sync the tasks with it
	useEffect(() => {
		const storedTasks = localStorage.getItem("tasks");
		if (storedTasks) {
			setTasks(JSON.parse(storedTasks));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}, [tasks]);

	const addTask = () => {
		console.log(taskInput)
		if (taskInput.trim() !== "") {
			setTasks([...tasks, { text: taskInput, completed: false }]);
			setTaskInput("");
		}
	};

	const toggleTask = (index) => {
		const updatedTasks = [...tasks];
		updatedTasks[index].completed = !updatedTasks[index].completed;
		setTasks(updatedTasks);
	};

	const deleteTask = (index) => {
		setTasks(tasks.filter((_, i) => i !== index));
	};

	return (
			<Card shadow="none" className="w-full mx-auto">
				<CardBody>
					<h3 className="mb-4 text-xl font-bont text-center" >
						Todo List
					</h3>
					<div className="flex items-center mb-4">
						<Input
							isClearable
							placeholder="Add a new task"
							fullWidth
							value={taskInput}
							onChange={(e) => setTaskInput(e.target.value)}
						/>
						<Button
							color="primary"
							className="ml-2"
							onPress={addTask}
						>
							Add
						</Button>
					</div>
					<div>
						{tasks.map((task, index) => (
							<div
								key={index}
								className="flex items-center justify-between mb-2 p-2 border rounded"
							>
								<Checkbox
									isSelected={task.completed}
									onChange={() => toggleTask(index)}
								>
									<span
										className={`ml-2 ${task.completed ? "line-through" : ""
											}`}
									>
										{task.text}
									</span>
								</Checkbox>
								<Button
									size="sm"
									color="danger"
									className="ml-2"
									onPress={() => deleteTask(index)}
								>
									Delete
								</Button>
							</div>
						))}
					</div>
				</CardBody>
			</Card>
	);
};

export default TodoComponent;