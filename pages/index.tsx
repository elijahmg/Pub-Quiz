import type { NextPage } from 'next';
import { Container, Card, Row, Text, Button } from '@nextui-org/react';
import { arrayUnion, doc, getFirestore } from '@firebase/firestore';
import { useFireBaseApp } from '../store/firebase';
import { setDoc, getDoc } from 'firebase/firestore';

const Home: NextPage = () => {
	const app = useFireBaseApp();
	const db = getFirestore(app);

	async function addData() {
		await setDoc(doc(db, 'quizes', 'X0SvdzLzrJjxbUBba9ff'), {
			name: 'Quiz 1',
			id: 'UUID',
			token: 'UNIQUE_TOKEN_TO_GET_INTO_QUIZ',
			tasks: {
				News: {
					'1': {
						question: 'Who said this',
						answer: 'you'
					}
				}
			},
			teams: [
				{
					id: 'UUID',
					name: 'Team 1',
					tasks: {
						News: {
							'1': {
								answer: 'He',
								point: '1'
							}
						}
					}
				}
			]
		});
	}

	async function getData() {
		const docRef = doc(db, 'cities', 'LA');
		const docSnap = await getDoc(docRef);

		const newVal = arrayUnion({ someKey: 'new' });

		await setDoc(docRef, { nest: newVal }, { merge: true });
	}

	return (
		<Container xs>
			<Card color="primary">
				<Row justify="center" align="center">
					<Text h6 size={15} color="white" css={{ m: 0 }}>
						NextUI gives you the best developer experience with all the features you need for building beautiful and
						modern websites and applications.
					</Text>
				</Row>
			</Card>
			<Button onClick={addData}>Add data</Button>
			<Button onClick={getData}>Get data</Button>
		</Container>
	);
};

export default Home;
