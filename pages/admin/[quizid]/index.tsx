import { useRouter } from 'next/router';
import { Button, Container, Text } from '@nextui-org/react';
import { Topic } from '../../../modules/topic';
import { doc, getFirestore } from '@firebase/firestore';
import { app } from '../../../utils/firebase-init';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { NextPageWithLayout } from '../../_app';
import { BackButton } from '../../../modules/back-button';

function AdminQuizPage<NextPageWithLayout>() {
	const [topics, setTopics] = useState<string[]>([]);
	const [activeTopic, setActiveTopic] = useState<string>(topics[0] || '');
	const router = useRouter();

	const { quizid } = router.query;

	useEffect(() => {
		if (!quizid) return;

		const db = getFirestore(app);
		const docRef = doc(db, 'quizzes', quizid as string);

		onSnapshot(docRef, doc => {
			const topics = Object.keys(doc.data()!.tasks);
			setTopics(topics);
			setActiveTopic(topics[0]);
		});
	}, [quizid]);

	return (
		<Container sm>
			<Text>Existing Topics:</Text>
			<Container display="flex">
				{topics?.map(topic => (
					<Button
						onClick={() => setActiveTopic(topic)}
						size="sm"
						light
						color={topic === activeTopic ? 'success' : 'primary'}
						key={topic}
					>
						{topic}
					</Button>
				))}
			</Container>
			{quizid && <Topic quizId={quizid as string} activeTopic={activeTopic} />}
			<Button
				color="success"
				type="submit"
				css={{
					mt: '4rem'
				}}
			>
				Start quiz
			</Button>
		</Container>
	);
}

AdminQuizPage.getLayout = (page: NextPageWithLayout) => (
	<>
		<BackButton href="/admin" title="Back to Admin page" />
		{page}
	</>
);

export default AdminQuizPage;
