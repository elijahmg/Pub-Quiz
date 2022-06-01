import { useEffect, useRef, useState } from 'react';

export function useQrReader() {
	const [error, setError] = useState<string | null>(null);

	const videoRef = useRef<HTMLVideoElement>(null);
	const detectorRef = useRef(null);

	const constraints = {
		video: { facingMode: { exact: 'environment' } },
		audio: false
	};

	useEffect(() => {
		const copyRef = videoRef.current;

		if (navigator.mediaDevices?.getUserMedia) {
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

		return () => {
			if (copyRef?.srcObject) {
				const tracks = (copyRef.srcObject as MediaStream).getTracks();
				tracks.forEach(t => t.stop());
				copyRef.srcObject = null;
			}
		};
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
					height: '20rem',
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
