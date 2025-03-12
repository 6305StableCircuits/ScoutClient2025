import { generate } from '$lib/server';
import { json } from '@sveltejs/kit';

export const GET = async () => {
    let key = generate();
    return json({
        key
    });
};
