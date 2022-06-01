export const QUIZZES_COLLECTION_ID = 'quizzes';

export enum QuizzesStatuses {
	INITIALIZED = 'initialized', // Client cannot connect, no questions filled in
	STARTED = 'started', // Questions filled in, clients can connect
	RUNNING = 'running', // Clients cannot connect
	PAUSED = 'paused', // do we need this status ???
	FINISHED = 'finished' // Clients cannot
}
