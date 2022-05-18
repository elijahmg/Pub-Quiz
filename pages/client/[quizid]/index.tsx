import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Quiz } from '../../admin/[quizid]/start';
import { Card, Input, Button, Text, Container } from '@nextui-org/react';
import { doc, getFirestore, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../../utils/firebase-init';

// X0SvdzLzrJjxbUBba9ff
const ClientQuizId: NextPage = () => {
	const [systemTeamName, setSystemTeamName] = useState('');
	const [teamNameInput, setTeamNameInput] = useState('');
	const [answer, setAnswer] = useState('');
	const [quiz, setQuiz] = useState<Quiz>();
	const router = useRouter();

	const { quizid } = router.query;

	const currentTopic = quiz?.currentPosition.topic || '';
	const currentQuestion = quiz?.currentPosition.question || '';

	useEffect(() => {
		if (!quizid) return;

		const db = getFirestore(app);
		const docRef = doc(db, 'quizzes', quizid as string);

		onSnapshot(docRef, doc => {
			setQuiz(doc.data() as Quiz);
			setAnswer('');
		});
	}, [quizid]);

	useEffect(() => {
		const storedTeamName = localStorage.getItem('teamName');

		if (storedTeamName) {
			setSystemTeamName(storedTeamName);
		}
	}, []);

	async function onSaveTeamName() {
		setSystemTeamName(teamNameInput);
		localStorage.setItem('teamName', teamNameInput);

		const db = getFirestore(app);
		const docRef = doc(db, 'quizzes', quizid as string);
		const data = await getDoc(docRef);

		if (!data.exists()) return;

		const quizData = data.data();

		quizData.teams[teamNameInput] = 'Connected';

		await updateDoc(docRef, quizData);
	}

	async function onAnswerSubmit() {
		if (!answer) return;

		const db = getFirestore(app);
		const docRef = doc(db, 'quizzes', quizid as string);
		const data = await getDoc(docRef);

		if (!data.exists()) return;

		const quizData = data.data();

		quizData.teams[systemTeamName] = {
			tasks: {
				...(quizData.teams[systemTeamName]?.tasks || {}),
				[currentTopic]: {
					...(quizData.teams[systemTeamName]?.tasks?.[currentTopic] || {}),
					[currentQuestion]: {
						answer: answer
					}
				}
			}
		};

		await updateDoc(docRef, quizData);
	}

	return (
		<Container sm css={{ h: '100vh' }} justify="center" display="flex">
			<Container
				fluid
				css={{
					p: 0,
					my: 'auto'
				}}
				justify="center"
				display="flex"
			>
				{!systemTeamName && (
					<>
						<Input
							css={{
								mt: '4rem'
							}}
							fullWidth
							value={teamNameInput}
							onChange={e => setTeamNameInput(e.target.value)}
							label="Team name"
						></Input>
						<Button
							onClick={onSaveTeamName}
							css={{
								mt: '1rem'
							}}
						>
							Save team name
						</Button>
					</>
				)}
				{systemTeamName && (
					<>
						<Text h2>{currentTopic}</Text>
						<Card color="primary">
							Q&nbsp;{currentQuestion}: {quiz?.tasks[currentTopic][currentQuestion].question}
						</Card>
						<Input
							value={answer}
							onChange={e => setAnswer(e.target.value)}
							css={{
								mt: '4rem'
							}}
							fullWidth
							label="Answer"
						></Input>
						<Button
							color="success"
							onClick={onAnswerSubmit}
							css={{
								mt: '1rem'
							}}
						>
							Submit answer
						</Button>
					</>
				)}
			</Container>
		</Container>
	);
};

export default ClientQuizId;
