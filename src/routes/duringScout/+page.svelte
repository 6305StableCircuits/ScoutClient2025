<script lang="ts">
  import { page } from "$app/stores";
  import { ButtonBgColors, ButtonSizes } from "$lib/ButtonStyles";
  import CheckboxWlabel from "$lib/components/checkboxWlabel.svelte";
  import Incrementor from "$lib/components/incrementor.svelte";
  import InScoutNav from "$lib/components/InScoutNav.svelte";
  import NewButton from "$lib/components/NewButton.svelte";
  import RadialWlabel from "$lib/components/radialWlabel.svelte";
  import { cageOrPark, CoralLevels, NavButtonIds, RankingPoints } from "$lib/utils";

  let notesEntry: HTMLParagraphElement;
  let notesText: string = $state("");

  // region params
  const scoutName = $page.url.searchParams.get("name");
  const teamNum = $page.url.searchParams.get("team_num");
  const team_color = $page.url.searchParams.get("team_color");
  const match_num = $page.url.searchParams.get("match_num");

  // tab
  let current_tab: NavButtonIds = $state(NavButtonIds.Auto);

  //#region scoring vars
  // coral scoring objs
  interface coral_score_type {
    l1: number;
    l2: number;
    l3: number;
    l4: number;
  }
  interface algae_score_type {
    net: number;
    barge: number;
  }
  interface endgame_tab_data {
    cageOrPark: cageOrPark
    rankingPoints: RankingPoints[]
  }

  let coral_score_auto: coral_score_type = $state({
    l1: 0,
    l2: 0,
    l3: 0,
    l4: 0,
  });
  let coral_score_teleop: coral_score_type = $state({
    l1: 0,
    l2: 0,
    l3: 0,
    l4: 0,
  });

  // algae scoring
  let algae_score_teleop: algae_score_type = $state({ net: 0, barge: 0 });
  let algae_score_auto: algae_score_type = $state({ net: 0, barge: 0 });

  // leave
  let leave_scored = $state(false);

  let endgame_data : endgame_tab_data = $state({
    cageOrPark: cageOrPark.None,
    rankingPoints: [RankingPoints.None, RankingPoints.None, RankingPoints.None, RankingPoints.None]
  })
  $inspect(endgame_data)
  //#endregion

  //#region util funcs
  function switchTab(id: NavButtonIds) {
    current_tab = id;
  }
  function submit(winLossTie: "win" | "loss" | "tie"){

  }
  //#endregion
</script>

<svelte:head>
  <title>{scoutName}'s scouting</title>
</svelte:head>

<main class="flex flex-col items-center w-[90%] max-w-3xl m-auto h-[80vh]">
  <InScoutNav bind:selected={current_tab} func={switchTab} />
  {#if current_tab === NavButtonIds.Auto}
    {@render AutoTab()}
    {:else if current_tab === NavButtonIds.Teleop}
    {@render TeleopTab()}
  {:else if current_tab === NavButtonIds.End}
    {@render EndTab()}
  {/if}
  {@render NotesEntry()} 

</main>

{#snippet TeleopTab()}
  <h1>Teleop</h1>
  {@render CoralScorer("teleop")}
  {@render AlgaeScorer("teleop")}
{/snippet}

{#snippet AutoTab()}
  <h1>Auto</h1>
  <CheckboxWlabel label=Leave: values={endgame_data.rankingPoints[3] as any} value={RankingPoints.Leave}></CheckboxWlabel>
  {@render CoralScorer("auto")}

  {@render AlgaeScorer("auto")}
{/snippet}
<!--#region End-->
{#snippet EndTab()}
  <h1>Endgame</h1 >
  <div class="m-2">
    <RadialWlabel label="Deep Cage: " values={endgame_data.cageOrPark} value={cageOrPark.Deep} friend_name="cageOrpark"></RadialWlabel>
    <RadialWlabel label="Shallow Cage: " values={endgame_data.cageOrPark} value={cageOrPark.Shallow} friend_name="cageOrpark"></RadialWlabel>
    <RadialWlabel label="Park: " values={endgame_data.cageOrPark} value={cageOrPark.Park} friend_name="cageOrpark"></RadialWlabel>
  </div>
  <h1  class="m-2 text-5xl">Ranking Points</h1>
  <div class="m-2">
    <CheckboxWlabel label="Coopertion: " values={endgame_data.rankingPoints[0] as any} value={RankingPoints.Coopertition}></CheckboxWlabel>
    <CheckboxWlabel label="Auto RP: " values={endgame_data.rankingPoints[1] as any} value={RankingPoints.Auto}></CheckboxWlabel>
    <CheckboxWlabel label="Coral RP: " values={endgame_data.rankingPoints[2] as any} value={RankingPoints.Coral}></CheckboxWlabel>
  </div>
  <div class="flex flex-col items-center">
  <div class="flex justify-between m-2">
    <NewButton text={"Win"} func={() => {submit("win")}} colour={ButtonBgColors.Win} size={ButtonSizes.Short}></NewButton>
    <NewButton text={"Lose"} func={() => {submit("loss")}} colour={ButtonBgColors.Lose} size={ButtonSizes.Short}></NewButton>
  </div>
  <NewButton text={"Submit (Tie)"} func={() => {submit("tie")}} colour={ButtonBgColors.Submit} size={ButtonSizes.SlightlyLessLong}></NewButton>
</div>
{/snippet}
<!--#endregion-->



<!--#region coral-->
{#snippet CoralScorer(section: "auto" | "teleop")}
  <label for='djdjdjdjrjkerjkdj' class="m-2">Coral</label>
  <div class="flex justify-between scale-[70%] lg:scale-100">
    {#if section === "teleop"}
      <div class="col_div m-2">
        <label for="_">L1</label>
        <Incrementor
          color={ButtonBgColors.ExtraOrange}
          MAX_SCORE={9e10}
          bind:value={coral_score_teleop.l1}
        />
      </div>
      <div class="col_div m-2">
        <label for="_">L2</label>
        <Incrementor
          color={ButtonBgColors.ExtraOrange}
          MAX_SCORE={9e10}
          bind:value={coral_score_teleop.l2}
        />
      </div>
      <div class="col_div m-2">
        <label for="_">L3</label>
        <Incrementor
          color={ButtonBgColors.ExtraOrange}
          MAX_SCORE={9e10}
          bind:value={coral_score_teleop.l3}
        />
      </div>
      <div class="col_div m-2">
        <label for="_">L4</label>
        <Incrementor
          color={ButtonBgColors.ExtraOrange}
          MAX_SCORE={9e10}
          bind:value={coral_score_teleop.l4}
        />
      </div>
    {:else}
      <div class="col_div m-2">
        <label for="_">L1</label>
        <Incrementor
          color={ButtonBgColors.ExtraOrange}
          MAX_SCORE={9e10}
          bind:value={coral_score_auto.l1}
        />
      </div>
      <div class="col_div m-2">
        <label for="_">L2</label>
        <Incrementor
          color={ButtonBgColors.ExtraOrange}
          MAX_SCORE={9e10}
          bind:value={coral_score_auto.l2}
        />
      </div>
      <div class="col_div m-2">
        <label for="_">L3</label>
        <Incrementor
          color={ButtonBgColors.ExtraOrange}
          MAX_SCORE={9e10}
          bind:value={coral_score_auto.l3}
        />
      </div>
      <div class="col_div m-2">
        <label for="_">L4</label>
        <Incrementor
          color={ButtonBgColors.ExtraOrange}
          MAX_SCORE={9e10}
          bind:value={coral_score_auto.l4}
        />
      </div>
    {/if}
    <!--TODO: FIGURE OUT WHAT THE ACTUAL MAX SCORE IS!!!!-->
  </div>
{/snippet}
<!--#endregion-->

<!--#region algae-->
{#snippet AlgaeScorer(section: "auto" | "teleop")}
  <label class="m-2">Algae</label>
  <div class="flex justify-between">
    {#if section === "auto"}
      <div class="col_div m-2">
        <label for="_">Net</label>
        <Incrementor
          color={ButtonBgColors.ExtraBlue}
          MAX_SCORE={9e2}
          bind:value={algae_score_auto.net}
          wide={true}
          extraStyles="h-[20vh]"
        />
      </div>
      <div class="col_div m-2">
        <label for="_">Barge</label>
        <Incrementor
          color={ButtonBgColors.ExtraBlue}
          MAX_SCORE={9e4}
          bind:value={algae_score_auto.barge}
          wide={true}
          extraStyles="h-[20vh]"
        />
      </div>
    {:else}
      <div class="col_div m-2">
        <label for="_">Net</label>
        <Incrementor
          color={ButtonBgColors.ExtraBlue}
          MAX_SCORE={9e2}
          bind:value={algae_score_teleop.net}
          wide={true}
          extraStyles="h-[20vh]"
        />
      </div>
      <div class="col_div m-2">
        <label for="_">Barge</label>
        <Incrementor
          color={ButtonBgColors.ExtraBlue}
          MAX_SCORE={9e4}
          bind:value={algae_score_teleop.barge}
          wide={true}
          extraStyles="h-[20vh]"
        />
      </div>
    {/if}
  </div>
{/snippet}
<!--#endregion-->

<!--#region notes-->
{#snippet NotesEntry()}
  <div class="flex justify-center flex-col items-center h-1/3 w-[100%]">
    <label for="_">Notes</label>
    <p
      bind:this={notesEntry}
      bind:textContent={notesText}
      contenteditable="true"
      class="text-white p-3 border-8 border-white bg-black overflow-auto w-[90%] h-[90%] text-ellipsis min-h-36"
    ></p>
  </div>
{/snippet}

<!--#endregion-->
<style>
  @import "tailwindcss/base";
  @import "tailwindcss/components";
  @import "tailwindcss/utilities";
  @layer components {
    .col_div {
      @apply flex flex-col items-center mt-4 mb-4;
    }
    label {
      @apply text-3xl font-[700];
    }
    h1 {
      @apply text-4xl font-[700]
    }
  }
</style>
