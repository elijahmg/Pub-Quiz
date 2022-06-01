import { useState } from 'react';
import type { NextPage } from 'next';
import { MainEntry } from '../modules/main-entry';
import { CreateQuizModal } from '../modules/create-quiz-modal';

const Home: NextPage = () => {
	const [visible, setVisible] = useState(false);

	return (
		<>
			<CreateQuizModal isModalVisible={visible} onToggleVisibility={setVisible} />
			<MainEntry onCreateQuizModalOpen={setVisible} />
		</>
	);
};

export default Home;
