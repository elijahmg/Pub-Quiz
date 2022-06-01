import { Button, Input, Modal, Text } from '@nextui-org/react';
import { useState } from 'react';
import { hash } from '../utils/hash';
import { getQuiz } from '../firestore-helpers/get-data';
import { Quiz } from '../pages/admin/[quizid]/running';
import { useRouter } from 'next/router';

interface Props {
	quizId: string;
	onToggleVisibility: (isVisible: string) => void;
	href: string;
}

export function VerificationModal({ quizId, onToggleVisibility, href }: Props) {
	const [pin, setPin] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	async function onVerify() {
		const hashedPin = hash(pin);
		const data = await getQuiz(quizId);

		const pinInDb = (data.data() as Quiz).pin;

		if (hashedPin !== pinInDb) {
			setError('Pin is wrong');
			return;
		}

		onToggleVisibility('');

		// @TODO callback must come outside
		router.push(`/admin/${href}`);
	}

	return (
		<Modal closeButton aria-labelledby="modal-title" open={!!quizId} onClose={() => onToggleVisibility('')}>
			<Modal.Header>
				<Text id="modal-title" size={18}>
					Type your pin for verification
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Input
					clearable
					bordered
					fullWidth
					color="primary"
					size="lg"
					placeholder="Pin"
					value={pin}
					type="password"
					onClick={() => setError('')}
					onChange={e => {
						setPin(e.target.value);
						setError('');
					}}
				/>
			</Modal.Body>
			{error && (
				<Text id="modal-title" size={14} color="red">
					{error}
				</Text>
			)}
			<Modal.Footer>
				<Button auto onClick={onVerify}>
					Verify
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
