import { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { Button } from '@nextui-org/react';

const Connect: NextPage = () => {
	const text = 'Almost before we knew it, we had left the ground.';
	const [data, setData] = useState('No result');

	const videoRef = useRef<HTMLVideoElement>(null);
	const detectorRef = useRef(null);

	useEffect(() => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			// Use video without audio
			const constraints = {
				video: true,
				audio: false,
				environment: 'environment'
			};

			if (videoRef.current) {
				navigator.mediaDevices.getUserMedia(constraints).then(stream => (videoRef.current!.srcObject = stream));
			}
		}

		if (!('BarcodeDetector' in window)) {
			setData('Barcode Detector is not supported by this browser.');
		} else {
			setData('Barcode Detector supported!');

			// create new detector
			// @ts-ignore
			detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] });
		}
	}, []);

	const detectCode = () => {
		detectorRef
			// @ts-ignore
			.current!.detect(videoRef.current)
			.then((codes: any) => {
				if (codes.length === 0) return;

				setData(codes[0].rawValue);
			})
			.catch((err: any) => {
				// Log an error if one happens
				console.error(err);
			});
	};

	return (
		<div
			style={{
				width: '20rem'
			}}
		>
			<video ref={videoRef} width={640} autoPlay />
			<Button onClick={() => detectCode()}>Detect</Button>
			<p>{data}</p>
		</div>
	);
};

export default Connect;
