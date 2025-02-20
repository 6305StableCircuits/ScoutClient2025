<script lang="ts">
  import { ButtonSizes, ButtonBgColors } from "$lib/ButtonStyles";
  import Dropdown from "$lib/components/Dropdown.svelte";
  import Incrementor from "$lib/components/incrementor.svelte";
  import InScoutNav from "$lib/components/InScoutNav.svelte";
import NewButton from "$lib/components/NewButton.svelte";
  import type { NavButtonIds } from "$lib/utils";
  import { redirect } from "@sveltejs/kit";
  let nav : InScoutNav;
  function change(id: NavButtonIds){
    
  }
  let DropdownValue: any;
  
  

</script>
<InScoutNav selected={2}  bind:this={nav} func={change}></InScoutNav>
<NewButton text="Win" func={() => {console.log("Win Button pressed")}} colour={ButtonBgColors.Win} size={ButtonSizes.Short}/>
<NewButton text="Lose" func={() => {console.log("Lose Button pressed")}} colour={ButtonBgColors.Lose} size={ButtonSizes.Short}/>
<NewButton text="Submit" func={() => {console.log("Submit Button pressed")}} colour={ButtonBgColors.Submit} size={ButtonSizes.Longest}/>
<NewButton text="Begin Scouting" func={() => {console.log("Begin Scouting Button pressed")}} colour={ButtonBgColors.Secondary} size={ButtonSizes.SlightlyLessLong}/>
<NewButton text="Scouting" func={() => {console.log("Scouting Button pressed")}} colour={ButtonBgColors.Primary} size={ButtonSizes.Longest}/>
<NewButton text="Leaderboard" func={() => {console.log("Leaderboard Button pressed")}} colour={ButtonBgColors.ExtraLightBlue} size={ButtonSizes.Longest}/>
<NewButton text="Extra1" func={() => {console.log("Etxra1 Button pressed")}} colour={ButtonBgColors.ExtraBlue} size={ButtonSizes.Longest}/>
<NewButton text="Submit" func={() => {console.log("Extra2 Button pressed")}} colour={ButtonBgColors.ExtraGreen} size={ButtonSizes.Longest}/>

<Incrementor color={ButtonBgColors.ExtraOrange} middle_opacity="brightness-75" MAX_SCORE={10}></Incrementor>
<Incrementor color={ButtonBgColors.ExtraLightBlue} middle_opacity="brightness-25" MAX_SCORE={20} wide={true}></Incrementor>
<Dropdown options={["Red", "Blue"]} bind:current_value={DropdownValue}></Dropdown>
<p>
  {DropdownValue}
</p>

