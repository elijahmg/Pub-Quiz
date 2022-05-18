import { useState } from 'react';
import type { NextPage } from 'next';
import * as crypto from 'crypto';
import { Container, Card, Row, Text, Button, Modal, Input } from '@nextui-org/react';
import { doc, getFirestore, addDoc, collection } from '@firebase/firestore';
import { useFireBaseApp } from '../store/firebase';
import { setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
	const [visible, setVisible] = useState(false);
	const [quizName, setQuizName] = useState('');
	const [pin, setPin] = useState('');

	const router = useRouter();

	const app = useFireBaseApp();
	const db = getFirestore(app);

	function hashPin() {
		const salt = crypto.randomBytes(16).toString('hex');

		return crypto.pbkdf2Sync(pin, salt, 1000, 10, `sha512`).toString(`hex`);
	}

	async function createQuiz() {
		const collectionRef = collection(db, 'quizzes');

		const output = await addDoc(collectionRef, {
			name: 'Quiz 1',
			pin: hashPin(),
			tasks: {},
			teams: {},
			status
		});

		setVisible(false);

		await router.push(`/admin/${output.id}`);
	}

	return (
		<>
			<Modal closeButton aria-labelledby="modal-title" open={visible} onClose={() => setVisible(false)}>
				<Modal.Header>
					<Text id="modal-title" size={18}>
						Name your quiz and create PIN to access it later
					</Text>
				</Modal.Header>
				<Modal.Body>
					<Input
						clearable
						bordered
						fullWidth
						color="primary"
						size="lg"
						placeholder="Quiz name"
						value={quizName}
						onChange={e => setQuizName(e.target.value)}
					/>
					<Input
						clearable
						bordered
						fullWidth
						color="primary"
						size="lg"
						placeholder="Pin"
						value={pin}
						type="number"
						onChange={e => setPin(e.target.value)}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button auto onClick={createQuiz}>
						Create
					</Button>
				</Modal.Footer>
			</Modal>
			<Container
				sm
				display="flex"
				justify="center"
				alignItems="center"
				css={{
					h: '100vh'
				}}
			>
				<Container
					css={{
						w: 'fit-content',
						h: 'fit-content',
						p: '2rem',
						// mt: '10rem',
						'box-shadow': '$md',
						'border-radius': '$md'
					}}
				>
					<Text h1 css={{ m: 0 }}>
						Pub quiz
					</Text>
					<Text h3 css={{ m: 0, 'max-width': '30rem' }}>
						This is simple application allows you to create, host or connect to pub quizzes
					</Text>
					<Row
						css={{
							mt: '4rem',
							'align-items': 'center',
							'justify-content': 'center'
						}}
					>
						<Button
							auto
							css={{
								mr: '.5rem'
							}}
							onClick={() => setVisible(true)}
						>
							Create quiz
						</Button>
						<Link href="/connect">
							<Button
								bordered
								auto
								css={{
									ml: '.5rem'
								}}
							>
								Connect
							</Button>
						</Link>
					</Row>
				</Container>
			</Container>
		</>
	);
};

export default Home;
