<script lang="ts">
    async function getMatchSchedule() {
        let matchScheduleResponse = await fetch("/api/frc/CAFR")
        return JSON.stringify(await matchScheduleResponse.json())
    }
    
</script>

{#await getMatchSchedule()}
    <p>loading</p>
{:then value } 
    
    <p>{value}</p>

{:catch error}
<p>{error}</p>
{/await}


