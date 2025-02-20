<script lang="ts">
    let {options, current_value = $bindable()} : {options: string[], current_value: any} = $props()

</script>

<select class="border-secondary border-8 rounded-[6px] bg-gray-100 text-GrayedOutText w-[173px] h-[66px]" bind:value={current_value}>
    {#each options as option }
        <option value={option}>{option}</option>
    {/each}
</select>


