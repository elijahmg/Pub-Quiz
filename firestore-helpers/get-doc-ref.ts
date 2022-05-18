import { doc, getFirestore } from '@firebase/firestore';
import { app } from '../utils/firebase-init';
import { QUIZZES_COLLECTION_ID } from './utils';

export function getDocRef(id: string) {
	const db = getFirestore(app);
	return doc(db, QUIZZES_COLLECTION_ID, id);
}
