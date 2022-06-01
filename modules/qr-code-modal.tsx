import { Modal, Text } from '@nextui-org/react';
import QRCode from 'react-qr-code';

export interface PartialQuizData {
	id: string;
	name: string;
}

interface Props {
	qrCodeData?: PartialQuizData;
	setQrCodeData: (data: PartialQuizData | undefined) => void;
}

export function QrCodeModal({ qrCodeData, setQrCodeData }: Props) {
	return (
		<Modal closeButton blur aria-labelledby="modal-title" open={!!qrCodeData} onClose={() => setQrCodeData(undefined)}>
			<Modal.Header>
				<Text id="modal-title" size={18}>
					QR code for &nbsp;
					<Text b size={18}>
						{qrCodeData?.name}
					</Text>
				</Text>
			</Modal.Header>
			<Modal.Body
				autoMargin
				css={{
					alignItems: 'center',
					mb: '1.3rem'
				}}
			>
				<QRCode value={qrCodeData?.id || ''} />
			</Modal.Body>
		</Modal>
	);
}
