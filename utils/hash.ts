import crypto from 'crypto';

export function hash(input: string) {
	const salt = 'secret_entry';

	return crypto.pbkdf2Sync(input, salt, 1000, 10, `sha512`).toString(`hex`);
}
