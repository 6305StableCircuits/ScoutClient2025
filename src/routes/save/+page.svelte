<script lang="ts">
    import Tree from '$lib/components/Tree.svelte';
    import Button from '$lib/components/Button.svelte';
    import { matches } from '$lib/stores';
    import { createDialog as create_dialog } from 'svelte-headlessui';
    import Transition from 'svelte-transition';
    import { save, key_generator } from './db.remote.js';
    const { data } = $props();
    const no_matches = $derived($matches.matches.length === 0);
    const dialog = create_dialog({ label: 'Delete scouting data?' });
    let download_link = $state<Record<string, any>>();
    let key = key_generator(data.key);
    let active_resolver: PromiseWithResolvers<boolean>['resolve'];
    function download() {
        const file = new Blob([JSON.stringify($matches)], { type: 'text/json;charset=utf-8;' });
        const url = URL.createObjectURL(file);
        download_link!.href = url;
        download_link!.download = file_name();
        download_link!.click();
        download_link!.href = 'about:blank';
        $matches.matches.length = 0;
    }
    function file_name() {
        const d = new Date();
        const date =
            [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ][d.getMonth()] +
            '_' +
            d.getDate() +
            ',_' +
            d.getFullYear() +
            '_at_' +
            d.getHours() +
            ':' +
            d.getMinutes() +
            (d.getHours() > 12 ? 'PM' : 'AM');
        return `scout_sessions_${date}.json`;
    }
    async function send() {
        $matches.key = await key;
        await save($matches as typeof $matches & { key: number }).updates();
        key = key_generator(key.current!);
        $matches = { matches: [] };
        return true;
    }
    async function delete_data() {
        dialog.open();
        const confirmation = await confirm();
        if (confirmation) {
            $matches.matches.length = 0;
        }
    }
    async function confirm(): Promise<boolean> {
        const { promise, resolve } = Promise.withResolvers<boolean>();
        active_resolver = resolve;
        return promise;
    }
</script>

<main>
    <Tree bind:object={$matches.matches}>
        You haven't entered any matches yet, start scouting!
    </Tree><br />
    <Button disabled={no_matches} onclick={download}>Export as JSON</Button>&nbsp;
    <Button disabled={no_matches} onclick={send}>Save Data</Button>&nbsp;
    <Button disabled={no_matches} class="bg-[#ef0305]" onclick={delete_data}>Delete Data</Button>
    <div class="relative z-10">
        <Transition show={$dialog.expanded}>
            <Transition
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Button class="fixed inset-0 bg-black bg-opacity-25" onclick={dialog.close} />
            </Transition>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-950 shadow-[0_0_2px_white] p-6 text-left align-middle shadow-xl transition-all"
                            use:dialog.modal
                        >
                            <h3 class="text-lg font-medium leading-6 text-white">Delete data?</h3>
                            <div class="mt-2">
                                <p class="text-sm text-grey-900">
                                    Are you sure you want to delete your scouting data? This cannot
                                    be undone!
                                </p>
                            </div>

                            <div class="mt-4">
                                <Button
                                    class="bg-specialred"
                                    onclick={() => {
                                        dialog.close();
                                        active_resolver(true);
                                    }}
                                >
                                    Delete
                                </Button>
                                <Button
                                    onclick={() => {
                                        dialog.close();
                                        active_resolver(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>
    </div>
    <!--svelte-ignore a11y_consider_explicit_label-->
    <a bind:this={download_link} style="display:none" href="about:blank" download><span></span></a>
</main>
