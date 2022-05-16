import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Container, Text } from '@nextui-org/react';
import { useQrReader } from '../hooks/use-qr-reader';

const Connect: NextPage = () => {
	const { videoElement, detectCode } = useQrReader();

	const router = useRouter();

	async function readQr() {
		const qrData = await detectCode();

		await router.push(`client/${qrData[0].rawValue}`);
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
				alignItems="center"
				display="flex"
			>
				<Text
					h2
					css={{
						textAlign: 'center',
						mb: '1rem'
					}}
				>
					Hi new team,<Text h4>please scan QR code, provided by Quiz master</Text>{' '}
				</Text>
				{videoElement}
				<Button size="xl" onClick={readQr}>
					Get into Quiz
				</Button>
			</Container>
		</Container>
	);
};

export default Connect;
