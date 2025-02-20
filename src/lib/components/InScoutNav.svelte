<!--
  @component
  ### NOTE:
  You should pass in a function that takes in the id of the the navButton, i.e.
  ```js
  fucntion redirect(navButtonIndex: NavButtonIds){
    switch (navButtonIndex){
        case NavButtonIds.Auto: {
            console.log("test")
        }
            
    }
  }
  ...
  ```
-->
<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  let { selected, func }: { selected: number; func: MouseEventHandler<HTMLButtonElement> } = $props();
</script>

<div class="relative top-0 flex justify-between">
  {@render navButton("Auto", selected === 0 ? true : false)}
  {@render navButton("Teleop", selected === 1 ? true : false)}
  {@render navButton("End", selected === 2 ? true : false)}
</div>
{#snippet navButton(text: String, selected: boolean = false)}
  <button
    onclick={func}
    class="rounded-[99px] hover:brightness-125 {selected ? 'bg-[#6567AE]': 'bg-secondary'}
    p-2 m-2 shadow-inner shadow-black w-[103px] h-[37px]"
    >{text}</button
  >
{/snippet}
