<script lang="ts">
    import {v4 as uuidv4} from 'uuid'

    
    interface Props{
        label: string;
        friend_name: string;
        values: number;
        value: number
    }
    let {label, values = $bindable(), friend_name, value} : Props  = $props();

    let id: string = uuidv4()
</script>


<div class="flex justify-center text-4xl font-[700] m-4">
    <label for={id} class="mr-3">{label}</label>
    <input
      type="radio"
      bind:group={values}
      {value}
      class="w-16 h-16 lg:w-10 lg:h-10 accent-secondary rounded-lg"
      {id}
      name={friend_name ?? id}
    />
</div>



