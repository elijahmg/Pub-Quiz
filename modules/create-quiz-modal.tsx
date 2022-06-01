import { Button, Input, Modal, Text } from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useFireBaseApp } from '../store/firebase';
import { addDoc, collection, getFirestore } from '@firebase/firestore';
import { QuizzesStatuses } from '../firestore-helpers/utils';
import { hash } from '../utils/hash';

interface Props {
	isModalVisible: boolean;
	onToggleVisibility: (isVisible: boolean) => void;
}

export function CreateQuizModal({ isModalVisible, onToggleVisibility }: Props) {
	const [quizName, setQuizName] = useState('');
	const [pin, setPin] = useState('');

	const router = useRouter();

	const app = useFireBaseApp();
	const db = getFirestore(app);

	async function createQuiz() {
		const collectionRef = collection(db, 'quizzes');

		const output = await addDoc(collectionRef, {
			name: quizName,
			pin: hash(pin),
			tasks: {},
			teams: {},
			status: QuizzesStatuses.INITIALIZED
		});

		onToggleVisibility(false);

		await router.push(`/admin/${output.id}`);
	}

	return (
		<Modal closeButton aria-labelledby="modal-title" open={isModalVisible} onClose={() => onToggleVisibility(false)}>
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
					type="password"
					onChange={e => setPin(e.target.value)}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button auto onClick={createQuiz}>
					Create
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
