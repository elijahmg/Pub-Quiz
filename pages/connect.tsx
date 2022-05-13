import { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@nextui-org/react';
import useQrReader from '../components/qr-reader';

const Connect: NextPage = () => {
	const [data, setData] = useState('No result');

	const { videoElement, detectCode } = useQrReader();

	async function readQr() {
		const qrData = await detectCode();
		setData(qrData[0].rawValue);
	}

	return (
		<div
			style={{
				width: '20rem'
			}}
		>
			{videoElement}
			<Button onClick={readQr}>Detect</Button>
			<p>{data}</p>
		</div>
	);
};

export default Connect;
