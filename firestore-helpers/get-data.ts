import { getDoc } from 'firebase/firestore';
import { getDocRef } from './get-doc-ref';

export async function getQuiz(quizId: string) {
	return await getDoc(getDocRef(quizId));
}
