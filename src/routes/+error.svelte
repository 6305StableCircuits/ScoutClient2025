<script lang="ts">
    //@ts-ignore
    import statuses from 'statuses';
    import { page } from '$app/state';
    console.log({ page, statuses });
    const message = 'message';
</script>

<main class="text-center">
    <h1 class="text-[5em]">
        {page.error!['code' as typeof message] ?? statuses.code[page.error!.message.toLowerCase()]}
    </h1>
    <br />
    <h2 class="text-[2em]">{page.error!.message}</h2>
</main>
