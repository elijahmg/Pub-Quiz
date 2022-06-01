import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Card, Container, Text, Col } from '@nextui-org/react';
import { getFirestore } from '@firebase/firestore';
import { app } from '../../utils/firebase-init';
import { collection, getDocs } from 'firebase/firestore';
import type { PartialQuizData } from '../../modules/qr-code-modal';
import { QrCodeModal } from '../../modules/qr-code-modal';
import { useMediaQuery } from '../../hooks/use-media-query';
import { NextPageWithLayout } from '../_app';
import { BackButton } from '../../modules/back-button';
import { VerificationModal } from '../../modules/verification-modal';

function Admin<NextPageWithLayout>() {
	const [quizzes, setQuizzes] = useState<PartialQuizData[]>([]);
	const [qrCodeData, setQrCodeData] = useState<PartialQuizData | undefined>(undefined);
	const [isVerificationModalVisible, setIsVerificationModalVisible] = useState<string>('');
	const [hrefAfterVerification, setHrefAfterVerification] = useState('');
	const isMd = useMediaQuery(960);

	async function getData() {
		const db = getFirestore(app);
		const docRef = collection(db, 'quizzes');
		const docs = await getDocs(docRef);
		const docsId: PartialQuizData[] = [];

		// @TODO make state of quiz
		docs.forEach(d => docsId.push({ id: d.id, name: d.data().name }));

		setQuizzes(docsId);
	}

	useEffect(() => {
		getData();
	}, []);

	return (
		<>
			<VerificationModal
				quizId={isVerificationModalVisible}
				href={hrefAfterVerification}
				onToggleVisibility={newValue => {
					setIsVerificationModalVisible(newValue);
					setHrefAfterVerification('');
				}}
			/>
			<QrCodeModal qrCodeData={qrCodeData} setQrCodeData={setQrCodeData} />
			<Container
				sm
				css={{
					h: '100vh'
				}}
			>
				<Container
					display="grid"
					css={{
						gridTemplateColumns: isMd ? '1fr' : 'repeat(2, 1fr)',
						gridRowGap: '.5em',
						gridColumnGap: '1em',
						alignItems: 'center'
					}}
				>
					{quizzes.map(quiz => (
						<Card cover css={{ mw: 400, mh: 300, justifySelf: 'center' }} key={quiz.id}>
							<Card.Header css={{ position: 'absolute', zIndex: 1, top: 5 }}>
								<Col>
									<Text size={12} weight="bold" transform="uppercase" color="#ffffffAA">
										Quiz
									</Text>
									<Text h3 color="white">
										{quiz.name}
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
									zIndex: 1,
									display: 'flex',
									justifyContent: 'space-between'
								}}
							>
								<Button.Group size="sm">
									<Button
										auto
										onClick={() => {
											setIsVerificationModalVisible(quiz.id);
											setHrefAfterVerification(`${quiz.id}`);
										}}
									>
										Edit
									</Button>
									<Button
										auto
										onClick={() => {
											setIsVerificationModalVisible(quiz.id);
											setHrefAfterVerification(`${quiz.id}/start`);
										}}
									>
										Start
									</Button>
								</Button.Group>
								<Button size="sm" color="warning" auto onClick={() => setQrCodeData(quiz)}>
									Show QR code
								</Button>
							</Card.Footer>
						</Card>
					))}
				</Container>
			</Container>
		</>
	);
}

Admin.getLayout = (page: NextPageWithLayout) => (
	<>
		<BackButton />
		{page}
	</>
);

export default Admin;
