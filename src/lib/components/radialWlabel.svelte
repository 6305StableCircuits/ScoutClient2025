<script lang="ts">


    
    interface Props{
        label: string;
        friend_name: string;
        values: number;
        value: number
    }
    let {label, values = $bindable(), friend_name, value} : Props  = $props();

    const id: string = $props.id()
</script>


<div class="flex justify-center text-4xl font-[700] m-4">
    <label for={id} class="mr-3">{label}</label>
    <input
      type="radio"
      bind:group={values}
      {value}
      class="w-[51px] h-[51px] lg:w-10 lg:h-10 accent-secondary rounded-full cursor-pointer"
      {id}
      name={friend_name ?? id}
    />
</div>



