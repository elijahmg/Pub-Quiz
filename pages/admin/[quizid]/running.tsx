import { NextPage } from 'next';
import { getDoc, updateDoc, doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { Button, Card, Container, Grid, Row, Text } from '@nextui-org/react';
import { app } from '../../../utils/firebase-init';
import { useEffect, useState, Fragment } from 'react';
import { QuizzesStatuses } from '../../../firestore-helpers/utils';
import { PartialQuizData, QrCodeModal } from '../../../modules/qr-code-modal';

interface Teams {
	[teamName: string]: {
		tasks: {
			[topic: string]: {
				[questionNumber: string]: {
					answer: string;
					point: number;
				};
			};
		};
	};
}

interface Tasks {
	[topic: string]: {
		[questionNumber: string]: {
			question: string;
			answer: string;
		};
	};
}

// @TODO think how to handle current position when app is started
export interface Quiz {
	name: string;
	pin: string;
	currentPosition?: {
		question: string;
		topic: string;
	};
	tasks: Partial<Tasks>;
	teams: Partial<Teams>;
	status: QuizzesStatuses;
}

interface RunningQuizProps {
	quiz: Quiz;
}

const RunningQuiz: NextPage<RunningQuizProps> = () => {
	const [quiz, setQuiz] = useState<Quiz>();
	const [qrCodeData, setQrCodeData] = useState<PartialQuizData | undefined>(undefined);
	const router = useRouter();

	const { quizid } = router.query;

	// @TODO refactor this
	const currentTopic = quiz?.currentPosition?.topic || '';
	const currentQuestion = quiz?.currentPosition?.question || '';

	const topics = Object.keys(quiz?.tasks || {}).sort();
	const indexOfCurrentTopic = topics.indexOf(currentTopic);
	const indexOfNextTopic = indexOfCurrentTopic + 1;
	const possibleNextTopic = topics[indexOfNextTopic];

	const indexOfPrevTopic = indexOfCurrentTopic - 1;
	const possiblePrevTopic = topics[indexOfPrevTopic];

	const questions = Object.keys(quiz?.tasks[currentTopic] || {});
	const indexOfCurrentQuestion = questions.indexOf(currentQuestion);

	const indexOfNextQuestion = indexOfCurrentQuestion + 1;
	const possibleNextQuestion = questions[indexOfNextQuestion];

	const indexOfPrevQuestion = indexOfCurrentQuestion - 1;
	const possiblePrevQuestion = questions[indexOfPrevQuestion];

	useEffect(() => {
		if (!quizid) return;

		const db = getFirestore(app);
		const docRef = doc(db, 'quizzes', quizid as string);

		onSnapshot(docRef, doc => setQuiz(doc.data() as Quiz));
	}, [quizid]);

	async function setTopic(possibleNextTopic: string) {
		const db = getFirestore(app);
		const docRef = doc(db, 'quizzes', quizid as string);
		const data = await getDoc(docRef);

		if (!data.exists()) return;

		const quizData = data.data();

		quizData.currentPosition.topic = possibleNextTopic;
		quizData.currentPosition.question = '1';

		await updateDoc(docRef, quizData);
	}

	async function setQuestion(possibleNextQuestion: string) {
		const db = getFirestore(app);
		const docRef = doc(db, 'quizzes', quizid as string);
		const data = await getDoc(docRef);

		if (!data.exists()) return;
		const quizData = data.data();

		quizData.currentPosition.question = possibleNextQuestion;

		await updateDoc(docRef, quizData);
	}

	// @TODO handle no quiz
	if (!quiz) return null;

	return (
		<>
			<QrCodeModal qrCodeData={qrCodeData} setQrCodeData={setQrCodeData} />
			<Container
				css={{
					my: 'auto'
				}}
				sm
			>
				<Row>
					{topics?.map(topic => (
						<Button size="sm" light color={topic === quiz.currentPosition?.topic ? 'success' : 'primary'} key={topic}>
							{topic}
						</Button>
					))}
				</Row>
				<Card>
					Q: {quiz.tasks?.[quiz.currentPosition?.topic || '']?.[quiz.currentPosition?.question || ''].question}
				</Card>
				<Row
					css={{
						mt: '1rem'
					}}
				>
					<Button.Group>
						<Button disabled={!possiblePrevQuestion} onClick={() => setQuestion(possiblePrevQuestion)}>
							Previous question
						</Button>
						<Button disabled={!possibleNextQuestion} onClick={() => setQuestion(possibleNextQuestion)}>
							Next question
						</Button>
					</Button.Group>
					<Button.Group>
						<Button onClick={() => setTopic(possiblePrevTopic)} bordered disabled={!possiblePrevTopic}>
							Previous topic
						</Button>
						<Button onClick={() => setTopic(possibleNextTopic)} bordered disabled={!possibleNextTopic}>
							Next topic
						</Button>
					</Button.Group>
					<Button.Group color="warning">
						<Button
							onClick={() =>
								setQrCodeData({
									name: quiz?.name,
									id: quizid as string
								})
							}
							bordered
						>
							Show QR code
						</Button>
					</Button.Group>
				</Row>
				<Grid.Container gap={2} justify="center">
					{Object.keys(quiz.teams || {}).map(team => (
						<Grid key={team}>
							<Card>
								<Card.Header>{team}</Card.Header>
								<Card.Body>
									{Object.keys(quiz?.teams?.[team]?.tasks || {})
										.reverse()
										.map(topic => (
											<Fragment key={topic}>
												<Text>{topic}</Text>
												{Object.keys(quiz?.teams?.[team]?.tasks[topic] || {})
													.reverse()
													.map(q => (
														<Text
															css={{
																ml: '1rem'
															}}
															key={q}
														>
															{q}: {quiz?.teams?.[team]?.tasks[topic][q].answer}
														</Text>
													))}
											</Fragment>
										))}
								</Card.Body>
							</Card>
						</Grid>
					))}
				</Grid.Container>
			</Container>
		</>
	);
};

export default RunningQuiz;
