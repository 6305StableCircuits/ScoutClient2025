<script lang="ts">
  import { ButtonSizes, ButtonBgColors } from "$lib/ButtonStyles";
  import CheckboxWlabel from "$lib/components/checkboxWlabel.svelte";
  import Dropdown from "$lib/components/Dropdown.svelte";
  import Incrementor from "$lib/components/incrementor.svelte";
  import InScoutNav from "$lib/components/InScoutNav.svelte";
import NewButton from "$lib/components/NewButton.svelte";
  import RadialWlabel from "$lib/components/radialWlabel.svelte";
  import { NavButtonIds } from "$lib/utils";
  import { redirect } from "@sveltejs/kit";
  let nav : InScoutNav;
  function change(id: NavButtonIds){
    console.log(id)
  }
  let value : number  = $state(1);
  let test : number[] = $state([])

  $inspect(value)
  $inspect(test)

</script>

<RadialWlabel label="AJ" friend_name="YAY" bind:values={value} value={0}></RadialWlabel>
<RadialWlabel label="djdj" friend_name="YAY" bind:values={value} value={1}></RadialWlabel>

<CheckboxWlabel label="hi" bind:values={test[0]} value={0}></CheckboxWlabel>
<CheckboxWlabel label="hi" bind:values={test[1]} value={1}></CheckboxWlabel>