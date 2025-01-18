<script lang="ts">
    import Tree from '$lib/components/Tree.svelte';
    import Button from '$lib/components/Button.svelte';
    import {matches} from '$lib/stores';
    //@ts-ignore
    import Papa from "papaparse";
    const {parse} = Papa;
    let downloadLink = $state<{[x:string]:any}>();
    let saved = $state(false);
    function download(type:"json"|"csv"){
        if(type === "json"){
            let file = new Blob([JSON.stringify($matches)],{type: 'text/json;charset=utf-8;'});
            let url = URL.createObjectURL(file);
            downloadLink!.href = url;
            downloadLink!.download = fileName();
            downloadLink!.click();
            downloadLink!.href = "about:blank";
            saved = true;
        }
    }
    const fileName = function(){
        let d = new Date();
        let date = (["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"][d.getMonth()] + "_" + d.getDate() + ",_" + d.getFullYear() + "_at_" + d.getHours() + ":" + d.getMinutes() + (d.getHours() > 12 ? "PM" : "AM"));
        return "scoutSessions_on_" + date + ".json";
    }
    async function send(){
        let csv = Papa.unparse(data);
        let headers:RequestInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify($matches)
        };
        let res = await fetch('../supabase',headers);
        if(res.status === 200){
            saved = true;
            return true;
        }
        return false;
    }
    $effect(()=>{
        if(saved === true){
            $matches = {matches:[]};
        }
    })
    function deleteData(){
        let confirmation = confirm("Are you sure you want to delete your scouting data? This cannot be undone!");
        if(confirmation){
            saved = true;
        }
    }
</script>
<main>
    <Tree bind:object={$matches.matches}>
        You haven't entered any matches yet, start scouting!
    </Tree><br>
    <Button disabled={$matches.matches.length === 0} onclick={()=>download("json")}>Export as JSON</Button>&nbsp;
    <!-- <Button disabled={$matches.matches.length === 0} onclick={send}>Save Data</Button>&nbsp; -->
    <Button disabled={$matches.matches.length === 0} onclick={send}>Save Data</Button>&nbsp;
    <Button disabled={$matches.matches.length === 0} class="bg-[#ef0305]" onclick={deleteData}>Delete Data</Button>
    <!--svelte-ignore a11y_consider_explicit_label-->
    <a bind:this={downloadLink} style="display:none" href="about:blank" download><span></span></a>
</main>