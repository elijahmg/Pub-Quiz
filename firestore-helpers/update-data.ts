import { AddPrefixToKeys } from '@firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { getDocRef } from './get-doc-ref';

export async function updateData(id: string, data: { [p: string]: any } & AddPrefixToKeys<string, any>) {
	await updateDoc(getDocRef(id), data);
}
