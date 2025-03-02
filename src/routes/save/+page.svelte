<script lang="ts">
    import Tree from '$lib/components/Tree.svelte';
    import Button from '$lib/components/Button.svelte';
    import { matches } from '$lib/stores';
    import { createDialog } from 'svelte-headlessui';
    import Transition from 'svelte-transition';
    import { onDestroy } from 'svelte';
    import { coerce } from '$lib';
    let dialog = createDialog({ label: 'Delete scouting data?' });
    let downloadLink = $state<{ [x: string]: any }>();
    let saved = $state(false);
    function download(type: 'json' | 'csv') {
        if (type === 'json') {
            let file = new Blob([JSON.stringify($matches)], { type: 'text/json;charset=utf-8;' });
            let url = URL.createObjectURL(file);
            downloadLink!.href = url;
            downloadLink!.download = fileName();
            downloadLink!.click();
            downloadLink!.href = 'about:blank';
            saved = true;
            $matches.matches.length = 0;
        }
    }
    const fileName = function () {
        let d = new Date();
        let date =
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
        return 'scoutSessions_on_' + date + '.json';
    };
    async function send() {
        let headers: RequestInit = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify($matches)
        };
        let res = await fetch('../supabase', headers);
        if (res.status === 200) {
            saved = true;
            $matches.matches.length = 0;
            return true;
        }
        return false;
    }
    async function deleteData() {
        dialog.open();
        let confirmation = await confirm();
        if (confirmation) {
            saved = true;
            $matches.matches.length = 0;
        }
    }
    let stateConfirm = $state<boolean | null>();
    let intervals = $state<(number | NodeJS.Timeout)[]>([]);
    onDestroy(() => {
        for (let interval of intervals) clearInterval(interval);
    });
    async function confirm(): Promise<boolean> {
        stateConfirm = null;
        // let timeout = new Promise((resolve,reject)=>{
        //     setTimeout(()=>{
        //         dialog.close();
        //         resolve(false);
        //     },60000);
        // }) as Promise<boolean>;
        let actual = new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                if (stateConfirm !== null) {
                    dialog.close();
                    clearInterval(interval);
                    intervals.splice(intervals.indexOf(interval), 1);
                    resolve(stateConfirm as boolean);
                }
            });
            intervals.push(coerce<number>(interval));
        }) as Promise<boolean>;
        return actual; //Promise.race([timeout,actual])
    }
</script>

<main>
    <Tree bind:object={$matches.matches}>
        You haven't entered any matches yet, start scouting!
    </Tree><br />
    <Button disabled={$matches.matches.length === 0} onclick={() => download('json')}
        >Export as JSON</Button
    >&nbsp;
    <Button disabled={$matches.matches.length === 0} onclick={send}>Save Data</Button>&nbsp;
    <Button
        disabled={$matches.matches.length !== 0 || false}
        class="bg-[#ef0305]"
        onclick={deleteData}>Delete Data</Button
    >
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
                                        stateConfirm = true;
                                    }}
                                >
                                    Delete
                                </Button>
                                <Button
                                    onclick={() => {
                                        stateConfirm = false;
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
    <a bind:this={downloadLink} style="display:none" href="about:blank" download><span></span></a>
</main>
