import { generate } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    let key = generate();
    return {
        key
    };
};
