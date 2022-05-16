import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { FirebaseApp } from 'firebase/app';
import { app } from '../utils/firebase-init';

const FirebaseContext = createContext<FirebaseApp | undefined>(undefined);

interface FirebaseWrapper {
	children?: React.ReactNode;
}

export const FirebaseWrapper: FC<FirebaseWrapper> = ({ children }) => {
	const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | undefined>();

	useEffect(() => {
		setFirebaseApp(app);
	}, []);

	return <FirebaseContext.Provider value={firebaseApp}>{children}</FirebaseContext.Provider>;
};

export const useFireBaseApp = () => {
	return useContext(FirebaseContext);
};
