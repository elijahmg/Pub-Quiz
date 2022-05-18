import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Container, FormElement, Input } from '@nextui-org/react';
import { deleteField } from 'firebase/firestore';
import { getQuiz } from '../firestore-helpers/get-data';
import { updateData } from '../firestore-helpers/update-data';

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
		setTopicState(activeTopic || '');
	}, [activeTopic]);

	async function getData() {
		const data = await getQuiz(quizId);

		if (data.exists()) {
			const questions = data.data()['tasks'][topicState];
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
		const notion = `tasks.${topicState}`;

		await updateData(quizId, {
			[notion]: questionsValue
		});
	}

	async function deleteTopic() {
		const notion = `tasks.${topicState}`;

		await updateData(quizId, {
			[notion]: deleteField()
		});
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
							bordered
							label={`Question ${q}`}
							onChange={e => onChange(e, q)}
							name="question"
							value={questionsValue?.[q]?.question || ''}
						/>
						<Input
							id={q + 'answer'}
							fullWidth
							bordered
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
