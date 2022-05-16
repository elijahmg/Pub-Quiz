import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Container, FormElement, Input, Card } from '@nextui-org/react';
import { getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { doc, getFirestore } from '@firebase/firestore';
import { app } from '../utils/firebase-init';

interface QuestionsValue {
	[questionKey: string]: {
		question: string;
		answer: string;
	};
}

interface TopicProps {
	quizId: string;
	activeTopic: string;
}

export function Topic({ quizId, activeTopic }: TopicProps) {
	const [topicState, setTopicState] = useState(activeTopic);
	const [questionsValue, setQuestionsValues] = useState<QuestionsValue>({});
	const questions = ['1', '2', '3', '4', '5'];

	useEffect(() => {
		getData();
	}, [topicState]);

	useEffect(() => {
		setTopicState(activeTopic);
	}, [activeTopic]);

	async function getData() {
		const db = getFirestore(app);
		const docRef = doc(db, 'quizes', quizId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const questions = docSnap.data()['tasks'][topicState];
			setQuestionsValues(questions);
		}
	}

	function onChange(e: ChangeEvent<FormElement>, questionNumber: string) {
		setQuestionsValues(prevState => ({
			...prevState,
			[questionNumber]: {
				...prevState?.[questionNumber],
				[e.target.name]: e.target.value
			}
		}));
	}

	async function onSaveTopicData() {
		const db = getFirestore(app);
		const docRef = doc(db, 'quizes', quizId);

		// Update to stay consistent
		const data = await getDoc(docRef);

		if (!data.exists()) return;

		const quizData = data.data();

		quizData.tasks = {
			...quizData.tasks,
			[topicState]: questionsValue
		};

		await updateDoc(docRef, quizData);
	}

	async function deleteTopic() {
		const db = getFirestore(app);
		const docRef = doc(db, 'quizes', quizId);
		const data = await getDoc(docRef);

		if (!data.exists()) return;
		const quizData = data.data();
		delete quizData.tasks[topicState];

		await updateDoc(docRef, quizData);
	}

	return (
		<>
			<Input label="Topic" id="topic" value={topicState} onChange={e => setTopicState(e.target.value)} />
			<Container sm>
				{questions.map(q => (
					<Container
						key={q}
						css={{
							mb: '2rem'
						}}
					>
						<Input
							id={q}
							fullWidth
							label={`Question ${q}`}
							onChange={e => onChange(e, q)}
							name="question"
							value={questionsValue?.[q]?.question || ''}
						/>
						<Input
							id={q + 'answer'}
							fullWidth
							label="Answer"
							name="answer"
							value={questionsValue?.[q]?.answer || ''}
							onChange={e => onChange(e, q)}
						/>
					</Container>
				))}
				<Container display="flex">
					<Button
						css={{
							mr: '2rem'
						}}
						bordered
						onClick={onSaveTopicData}
					>
						Save topic
					</Button>
					<Button bordered color="error" onClick={deleteTopic}>
						Delete topic
					</Button>
				</Container>
			</Container>
		</>
	);
}
