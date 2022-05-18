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
		<Container sm justify="center" display="flex">
			<Container
				fluid
				css={{
					p: 0,
					my: 'auto',
					mt: '2rem',
					'flex-direction': 'column'
				}}
				justify="center"
				alignItems="center"
				display="flex"
			>
				<Text
					h2
					css={{
						textAlign: 'center'
					}}
				>
					Hi new team,
				</Text>
				<Text
					h4
					css={{
						mb: '1rem'
					}}
				>
					please scan QR code, provided by Quiz master
				</Text>{' '}
				{videoElement}
				<Button size="xl" onClick={readQr}>
					Get into Quiz
				</Button>
			</Container>
		</Container>
	);
};

export default Connect;
