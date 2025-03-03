<script lang="ts">
  import { ButtonBgColors } from "$lib/ButtonStyles";
  import type { IncrementorOpacities } from "$lib/types";
  interface Props {
    net?: boolean;
    color: ButtonBgColors;
    middle_opacity?: IncrementorOpacities;
    wide?: boolean;
    MAX_SCORE: number;
    value: number;
    increment_override? : any;
    decrement_override?: any;
    extraStyles? : string
  }
  let {
    net = false,
    color,
    middle_opacity,
    wide = false,
    MAX_SCORE,
    value = $bindable<number>(),
    increment_override,
    decrement_override,
    extraStyles = ""

  }: Props = $props();

  // If not wide make it not wide
  let size = !wide ? "w-[94px] h-[203px]" : "w-[172px] h-[197px]";
  let minus_button: HTMLButtonElement;
  let plus_button: HTMLButtonElement;

  let second_color : string | undefined = $state(undefined)
  // Make darker orange if orange
  if (color === ButtonBgColors.ExtraOrange){
    second_color = "bg-[#bf6443]"
  }
  // Check  if if it's less than inside the accpeted values, if not don't change anything
  $effect(() => {
    if (value <= 0) {
      value = 0;
      minus_button.disabled = true;
    } else {
      minus_button.disabled = false;
    }
    if (value >= MAX_SCORE) {
      value = MAX_SCORE;
      plus_button.disabled = true;
    } else {
      plus_button.disabled = false;
    }
  });
  function increment() {
    value++;
  }
  function decrement() {
    value--;
  }

</script>

  
  <div  id="incrementor" class="{size} {color} rounded-[15px] z-0 relative {extraStyles} h-[20vh]">
    <!-- svelte-ignore a11y_consider_explicit_label -->
     {#if net===true}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 183 197" class="z-[100%] h-[100%] w-[200%] absolute">
      <path stroke="#000000" stroke-opacity=".39" d="m13.613-29.395 216.693 167.822M4.393-17.488l216.694 167.822M-4.826-5.581l216.693 167.823M-14.046 6.327l216.694 167.822M-23.265 18.234l216.693 167.823M-32.485 30.142l216.693 167.822M-41.705 42.049l216.694 167.822M69.174-79.581 285.867 88.242M59.954-67.673l216.693 167.822M50.735-55.766l216.693 167.823M41.515-43.858l216.693 167.822M32.295-31.951l216.694 167.822M-60.387 44.605l216.693 167.822M-69.607 56.512l216.694 167.822M-78.826 68.419l216.693 167.823M-88.046 80.327l216.694 167.822M-97.265 92.234l216.693 167.823m-225.913-155.915 216.693 167.822M215.395 21.613 47.573 238.306M203.488 12.393 35.666 229.087M191.581 3.174 23.758 219.867M179.673-6.046 11.851 210.648M167.766-15.265-.057 201.428M155.858-24.485-11.964 192.208M143.951-33.705-23.871 182.989M265.581 77.174 97.758 293.867M253.673 67.954 85.851 284.647M241.766 58.735 73.944 275.428M229.858 49.515 62.036 266.208M217.951 40.295 50.129 256.989m91.266-309.376L-26.427 164.306M129.488-61.607-38.334 155.087M117.581-70.826-50.242 145.867M105.673-80.046-62.149 136.648M93.766-89.265-74.056 127.428M81.858-98.485-85.964 118.208"/>
    </svg>
    {/if}
    
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
      class="flex p-[1rem]  transition-all duration-[300ms] h-1/3 justify-center items-center w-[100%] {color} disabled:brightness-[200%] rounded-tr-[15px] rounded-tl-[15px] hover:brightness-125 z-20"
      onclick={increment_override ?? increment}
      bind:this={plus_button}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="none"
        viewBox="0 0 32 32"
      >
        <path
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="4"
          d="M16 2v28M2 16h28"
        />
      </svg>
    </button>

    <div
      class="h-1/3 {color} flex justify-center items-center shadow {second_color ?? ""}"
    >
      <p class="font-Inter font-[700px] text-[37.9px] text-white brightness-125 ">
        {value}
      </p>
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
      class="flex h-1/3 justify-center p-[1rem] items-center w-[100%] {color} disabled:brightness-100 rounded-br-[15px] rounded-bl-[15px] hover:brightness-125"
      onclick={decrement_override ?? decrement}
      bind:this={minus_button}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="4"
        fill="none"
        viewBox="0 0 32 4"
      >
        <path
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="4"
          d="M2 2h28"
        />
      </svg>
    </button>
  </div>



<style>


      .shadow{
        box-shadow: inset 0 0px 8px rgba(0, 0, 0, 0.4)
      }
    
</style>

