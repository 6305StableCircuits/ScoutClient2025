<!-- 
  @component
  ### NOTE:
  You should pass in a function that takes in the id of the the navButton, i.e.
  ```js
  function redirect(navButtonIndex: NavButtonIds){
    switch (navButtonIndex){
        case NavButtonIds.Auto: {
            console.log("test")
        }
            
    }
  }
  
  ```
-->

<script lang="ts">
  import { NavButtonIds } from '$lib/utils';
  import type { MouseEventHandler } from 'svelte/elements';

  let { selected, func }: { selected: number; func: any } = $props();
</script>

<div class="relative top-0 flex justify-between">
  {@render navButton("Auto", selected === 0 ? true : false, NavButtonIds.Auto)}
  {@render navButton("Teleop", selected === 1 ? true : false, NavButtonIds.Teleop)}
  {@render navButton("End", selected === 2 ? true : false, NavButtonIds.End)}
</div>
{#snippet navButton(text: String, selected: boolean = false, id: NavButtonIds)}
  <button
    onclick={()=>func(id)}
    class="rounded-[99px] hover:brightness-125 {selected ? 'bg-[#6567AE]': 'bg-secondary'}
    p-2 m-2 shadow-inner shadow-black w-[103px] h-[37px]"
    >{text}</button
  >
{/snippet}
