<script lang="ts">
    import {v4 as uuidv4} from 'uuid'

    
    interface Props{
        radial_button: boolean;
        label: string;
        friend_name: string;
        values: number;
        value: number
    }
    let {radial_button, label, values = $bindable(), friend_name, value} : Props  = $props();

    let id: string = uuidv4()
</script>


<div class="flex justify-center">
    <label for={id} class="text-3xl font-[700] mr-3">{label}</label>
    {#if radial_button}
    <input
      type="radio"
      bind:group={values}
      {value}
      class="w-10 h-10 accent-secondary rounded-lg"
      {id}
      name={friend_name ?? id}
    />
    {:else}

    {/if}
</div>



