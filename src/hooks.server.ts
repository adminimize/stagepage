import type { Handle } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
	// TODO: Add authentication logic here if needed
	event.locals.user = null;
	event.locals.session = null;
	return resolve(event);
};

export const handle: Handle = handleAuth;
