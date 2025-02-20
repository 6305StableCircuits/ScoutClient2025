<script lang="ts">
  import { ButtonSizes, Colors } from "$lib/ButtonStyles";
  import Incrementor from "$lib/components/incrementor.svelte";
  import InScoutNav from "$lib/components/InScoutNav.svelte";
import NewButton from "$lib/components/NewButton.svelte";


</script>
<InScoutNav selected={2}></InScoutNav>
<NewButton text="Win" func={() => {console.log("Win Button pressed")}} colour={Colors.Win} size={ButtonSizes.Short}/>
<NewButton text="Lose" func={() => {console.log("Lose Button pressed")}} colour={Colors.Lose} size={ButtonSizes.Short}/>
<NewButton text="Submit" func={() => {console.log("Submit Button pressed")}} colour={Colors.Submit} size={ButtonSizes.Longest}/>
<NewButton text="Begin Scouting" func={() => {console.log("Begin Scouting Button pressed")}} colour={Colors.Secondary} size={ButtonSizes.SlightlyLessLong}/>
<NewButton text="Scouting" func={() => {console.log("Scouting Button pressed")}} colour={Colors.Secondary} size={ButtonSizes.Longest}/>
<NewButton text="Leaderboard" func={() => {console.log("Leaderboard Button pressed")}} colour={Colors.ExtraLightBlue} size={ButtonSizes.Longest}/>
<NewButton text="Extra1" func={() => {console.log("Etxra1 Button pressed")}} colour={Colors.ExtraBlue} size={ButtonSizes.Longest}/>
<NewButton text="Submit" func={() => {console.log("Extra2 Button pressed")}} colour={Colors.ExtraGreen} size={ButtonSizes.Longest}/>

<Incrementor color={Colors.ExtraOrange} middle_opacity="brightness-75" MAX_SCORE={10}></Incrementor>
<Incrementor color={Colors.ExtraLightBlue} middle_opacity="brightness-25" MAX_SCORE={20} wide={true}></Incrementor>

