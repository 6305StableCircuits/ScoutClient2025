<script lang="ts">
  import { goto } from "$app/navigation";
  import { ButtonBgColors } from "$lib/ButtonStyles";
  import Dropdown from "$lib/components/Dropdown.svelte";
  import NewButton from "$lib/components/NewButton.svelte";
  import type { TeamColors } from "$lib/types";


  
  let max_reached = $state(false);

  let errors_text : HTMLParagraphElement;
  let errors_head: HTMLLabelElement;


  let scout_name = $state("");
  let team_num: number | undefined = $state();
  let team_color: TeamColors = $state("Red");
  let match_num: number | undefined = $state();
  // $effect(() => {
  //   if (scout_name.length >= 20) {
  //     scout_name = scout_name.substring(0, 20); // idk 'bout this
  //     max_reached = true;
  //   } else {
  //     max_reached = false;
  //   }
  // });

  function validate(data : Map<string, string | Number | TeamColors | undefined >){
    let data_errors : string[] = []
    if (data.get("name") === "" || data.get("name") === undefined){
      data_errors.push("Scout name is empty, please put a name")
    }
    if (data.get("team_num") !== undefined ){
      //@ts-ignore ts(2532) because it's saying that it might be undefinerd even tho I already checked
      if (data.get("team_num").toString().length < 3){ 
        data_errors.push("Team # is too short, please put a team value")
      }
    }
    else{
      data_errors.push("Team # is empty, please put a value")
    }
    if (data.get("match_num") === undefined ){
      data_errors.push("Match # is empty, please put a value")
    }
    return data_errors
    
  }

  function begin_scout(){
    let data = new Map<string, string | Number | TeamColors | undefined>()
    data.set("name", scout_name)
    data.set("team_num", team_num)
    data.set("team_color", team_color)
    data.set("match_num", match_num)
    console.info(data)
    let errors: string[] = validate(data)
    if (errors.length !== 0){ // if there are errors
      errors_text.hidden = false;
      errors_head.hidden = false;
      errors_text.textContent = "" // clear it just in case there were previous errors
      errors.forEach(element => {
        errors_text.textContent += element + (errors.indexOf(element) !== errors.length-1 ? ", \n" : ".") // append every error to the errors_text and add a comma or period
      });
      
    }
    else{
      goto(`/duringScout?name=${scout_name}&team_num=${team_num}&team_color=${team_color}&match_num=${match_num}`)
    }
    

  }
</script>

<main class="flex justify-center max-w-[1440px] m-auto">
  <div class="flex h-[80vh] flex-col items-center">
    <h1 class="m-5 text-5xl font-[700]">New Game</h1>
    <div>
      <label for="_" bind:this={errors_head} hidden> <!--It's a label because labels are already styled nicely-->
        Errors(s): 
      </label>
      <p hidden class="text-red-400 whitespace-pre-line sm:text-2xl" bind:this={errors_text}>
        

      </p>
    </div>
    <div>
      <label for="name"
        >Scouter Name: <span class="text-red-400 italic">{max_reached ? "(max of 20 characters)" : ""}</span></label
      >
      <input
        type="text"
        placeholder="John Smith"
        name="name"
        bind:value={scout_name}
        class="text_input lg:w-[400px] lg:h-[76px] w-[173px] h-[66px] "
      />
    </div>

    <div>
      <label for="team_num">Team Number: </label>
      <input
        type="number"
        name="team_num"
        bind:value={team_num}
        class="text_input  w-[173px] h-[66px] font-[700] text-[30px]"
        placeholder="6305"
      />
    </div>

    <div>
      <label for="team_color">Team Color: </label> <!--for="team_color doesn't do anything"-->
      <Dropdown options={["Red", "Blue"]} bind:current_value={team_color}></Dropdown>
    </div>

    <div>
      <label for="match_num">Match #: </label>
      <input
        type="number"
        name="match_num"
        class="text_input w-[173px] h-[66px] font-[700] text-[30px]"
        bind:value={match_num}
        placeholder="42"
      />
    </div>

    <div>
      <NewButton text="Begin Scouting" func={begin_scout} colour={ButtonBgColors.Secondary} extraStyles="m-2 w-[50vw]"/>
    </div>
  </div>
</main>

<style>
  @import "tailwindcss/base";
  @import "tailwindcss/components";
  @import "tailwindcss/utilities";
  @layer components {
    .text_input {
      @apply p-1 placeholder:text-GrayedOutText lg:text-[36px] text-[30] font-[700] placeholder:font-[700] border-secondary border-8 rounded-[6px]  bg-gray-100  text-black ;
    }
  }
  div {
    @apply flex flex-col items-center m-auto;
  }
  label {
    @apply text-3xl font-[700];
  }
</style>
