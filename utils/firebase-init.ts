// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// console.log(process.env);
const firebaseConfig = {
	apiKey: process.env.apiKey,
	authDomain: 'pub-quiz-44072.firebaseapp.com',
	projectId: 'pub-quiz-44072',
	storageBucket: 'pub-quiz-44072.appspot.com',
	messagingSenderId: '386561935045',
	appId: '1:386561935045:web:e7b2c6b3d218519d4b92ac'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
