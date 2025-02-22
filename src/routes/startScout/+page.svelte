<script lang="ts">
  let scout_name = $state("");
  $effect(() => {
    if (scout_name.length >= 10){
    scout_name = scout_name.substring(0, 20) // idk 'bout this
  }
  })

</script>

<main class="flex justify-center">
  <div class="flex h-screen flex-col items-center">
    <h1>New Game</h1>
    <p class="">Scouter Name:</p>
    <input
      type="text"
      placeholder="John Smith"
      name="name"
      bind:value={scout_name}
      class="p-1 placeholder:text-GrayedOutText lg:text-[36px] text-[30x] font-[700] placeholder:font-[700] border-secondary border-8 rounded-[6px]  bg-gray-100  text-black lg:w-[400px] lg:h-[76px] w-[173px] h-[66px] "
    />
    <label for="name">Scouter Name: </label>
    <input type="text" name="name" bind:value={scout_name} />
  </div>
</main>
<!-- 
<style>
  input[type=text]{
    background-color: white;
  }
</style> -->
