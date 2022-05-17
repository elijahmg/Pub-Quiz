import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Button, Card, Container, Text, Col, Modal } from '@nextui-org/react';
import { getFirestore } from '@firebase/firestore';
import { app } from '../../utils/firebase-init';
import { collection, getDocs } from 'firebase/firestore';
import QRCode from 'react-qr-code';

interface Quizes {
	id: string;
	name: string;
}

const Admin: NextPage = () => {
	const [quizes, setQuizes] = useState<Quizes[]>([]);
	const [isQrCodeVisible, setIsQrCodeVisible] = useState<Quizes | undefined>(undefined);

	async function getData() {
		const db = getFirestore(app);
		const docRef = collection(db, 'quizes');
		const docs = await getDocs(docRef);
		const docsId: Quizes[] = [];

		docs.forEach(d => docsId.push({ id: d.id, name: d.data().name }));

		setQuizes(docsId);
	}

	useEffect(() => {
		getData();
	}, []);

	return (
		<Container sm>
			<Modal
				closeButton
				blur
				aria-labelledby="modal-title"
				open={!!isQrCodeVisible}
				onClose={() => setIsQrCodeVisible(undefined)}
			>
				<Modal.Header>
					<Text id="modal-title" size={18}>
						QR code for &nbsp;
						<Text b size={18}>
							{isQrCodeVisible?.name}
						</Text>
					</Text>
				</Modal.Header>
				<Modal.Body
					autoMargin
					css={{
						alignItems: 'center'
					}}
				>
					<QRCode value={isQrCodeVisible?.id || ''} />
				</Modal.Body>
			</Modal>
			{quizes.map(topic => (
				<Card cover css={{ mw: 400, mh: 300 }} key={topic.id}>
					<Card.Header css={{ position: 'absolute', zIndex: 1, top: 5 }}>
						<Col>
							<Text size={12} weight="bold" transform="uppercase" color="#ffffffAA">
								Quiz
							</Text>
							<Text h3 color="white">
								{topic.name}
							</Text>
						</Col>
					</Card.Header>
					<Card.Body>
						<Card.Image
							src="https://images.unsplash.com/photo-1558210598-89ba75b1724e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
							height={400}
							width="100%"
							alt="Card example background"
						/>
					</Card.Body>
					<Card.Footer
						blur
						css={{
							position: 'absolute',
							bgBlur: '#ffffff',
							borderTop: '$borderWeights$light solid rgba(255, 255, 255, 0.2)',
							bottom: 0,
							zIndex: 1
						}}
					>
						<Button.Group>
							<Link href={`/admin/${topic.id}`}>
								<Button size="xs">Edit {topic.name}</Button>
							</Link>
							<Button size="xs" onClick={() => setIsQrCodeVisible(topic)}>
								Show QR code
							</Button>
							<Link href={`/admin/${topic.id}/start`}>
								<Button size="xs">Start quiz</Button>
							</Link>
						</Button.Group>
					</Card.Footer>
				</Card>
			))}
		</Container>
	);
};

export default Admin;