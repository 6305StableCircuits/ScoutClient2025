<script lang="ts">
    

    
    interface Props{
        label: string;
        values: any[];
        value: number
    }
    let {label, values = $bindable(), value} : Props  = $props();

    const id = $props.id();
</script>


<div class="flex justify-center text-4xl font-[700] m-4">
    <label for={id} class="mr-3">{label}</label>
    <input
      type="checkbox"
      bind:group={values}
      {value}
      class="w-16 h-16 lg:w-10 lg:h-10 accent-secondary rounded-lg"
      {id}
      name={id}
    />
</div>



