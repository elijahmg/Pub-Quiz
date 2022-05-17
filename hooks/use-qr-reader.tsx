import { useEffect, useRef, useState } from 'react';

export function useQrReader() {
	const [error, setError] = useState<string | null>(null);

	const videoRef = useRef<HTMLVideoElement>(null);
	const detectorRef = useRef(null);

	useEffect(() => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			// Use video without audio
			const constraints = {
				video: { facingMode: { exact: 'environment' } },
				audio: false
			};
			if (videoRef.current) {
				navigator.mediaDevices.getUserMedia(constraints).then(stream => (videoRef.current!.srcObject = stream));
			}
		}

		if (!('BarcodeDetector' in window)) {
			setError('Barcode Detector is not supported by this browser.');
		} else {
			// @ts-ignore
			detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] });
		}
	}, []);

	async function detectCode() {
		try {
			// @ts-ignore
			return detectorRef.current!.detect(videoRef.current);
		} catch (err: any) {
			setError(err);
		}
	}

	const videoElement = (
		<>
			<video
				style={{
					width: '20rem',
					border: '2px grey solid',
					padding: '4px',
					marginBottom: '2rem'
				}}
				ref={videoRef}
				autoPlay
			/>
			{error && <p>{error}</p>}
		</>
	);

	return {
		detectCode,
		videoElement
	};
}
