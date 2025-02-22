<script lang="ts">
  let scout_name = $state("");
  let max_reached = $state(false);
  let team_num : number | undefined = $state();
  $effect(() => {
    if (scout_name.length >= 20){
    scout_name = scout_name.substring(0, 20) // idk 'bout this
    max_reached = true;
  }
  else{
    max_reached = false;
  }
  })

</script>

<main class="flex justify-center max-w-[1440px] m-auto">
  <div class="flex h-screen flex-col items-center">
    <h1 class="mb-5">New Game</h1> 
    <div>
      <label for="name" class="text-3xl font-[700]">Scouter Name: <span class="text-red-400 italic">{max_reached ? "(max of 20 characters)" : ""}</span></label>
      <input
        type="text"
        placeholder="John Smith"
        name="name"
        bind:value={scout_name}
        class="text_input"
      />
    </div>

    <div>
      <label for="team-num" class="text-3xl font-[700]">Team Number: </label>
      <input type="number" name="team-num" bind:value={team_num} class="text_input" placeholder="6305" />
    </div>
  </div>
</main>

<style>
  @import "tailwindcss/base";
  @import "tailwindcss/components";
  @import "tailwindcss/utilities";
  @layer components{
    .text_input{
      @apply p-1 placeholder:text-GrayedOutText lg:text-[36px] text-[30] font-[700] placeholder:font-[700] border-secondary border-8 rounded-[6px]  bg-gray-100  text-black lg:w-[400px] lg:h-[76px] w-[173px] h-[66px] 
    }
  }
  div{
    @apply flex flex-col items-center m-auto
  }
</style>
