<script lang="ts">
    import { page } from "$app/stores";
    import { ButtonBgColors } from "$lib/ButtonStyles";
    import Incrementor from "$lib/components/incrementor.svelte";
    import InScoutNav from "$lib/components/InScoutNav.svelte";
    import { CoralLevels, NavButtonIds } from "$lib/utils";
    import type { SvelteComponent } from "svelte";

    // util variabkles
    let incrementor_opacities_arr = [25, 50, 75, 90]


    const scoutName = $page.url.searchParams.get("name");
    const teamNum = $page.url.searchParams.get("team_num");
    const team_color = $page.url.searchParams.get("team_color");
    const match_num = $page.url.searchParams.get("match_num");

    let current_tab: NavButtonIds = $state(NavButtonIds.Auto);

    interface coral_score_type {
        l1: number;
        l2: number;
        l3: number;
        l4: number;
    }

    let coral_score_auto: coral_score_type = $state({ l1: 0, l2: 0, l3: 0, l4: 0 });
    let coral_score_teleop: coral_score_type = $state({ l1: 0, l2: 0, l3: 0, l4: 0 });

    function switchTab(id: NavButtonIds) {
        current_tab = id;
    }

</script>

<main class="flex flex-col items-center w-screen">
    <InScoutNav bind:selected={current_tab} func={switchTab} />
    {#if current_tab === NavButtonIds.Auto}
        {@render AutoTab()}
    {:else if current_tab === NavButtonIds.Teleop}
        {@render TeleopTab()}
    {:else if current_tab === NavButtonIds.End}
        {@render EndTab()}
    {/if}
</main>

{#snippet AutoTab()}
    <h1>Auto</h1>
    {@render CoralScorer("auto")}
{/snippet}

{#snippet TeleopTab()}
    <h1>Teleop</h1>
    {@render CoralScorer("teleop")}
{/snippet}

{#snippet EndTab()}
    <p>end</p>
{/snippet}

{#snippet CoralScorer(section: "auto" | "teleop")}
    <div class="flex justify-between">
            {#if section==="teleop"}
                <div class="col_div">
                    <label for="_">L1</label>
                    <Incrementor
                    color={ButtonBgColors.ExtraOrange}
                    MAX_SCORE={9e10}
                    bind:value={coral_score_teleop.l1}
                />
                </div>
                <div class="col_div">
                    <label for="_">L2</label>
                    <Incrementor
                    color={ButtonBgColors.ExtraOrange}
                    MAX_SCORE={9e10}
                    bind:value={coral_score_teleop.l2}
                />
                </div>
                <div class="col_div">
                    <label for="_">L3</label>
                    <Incrementor
                    color={ButtonBgColors.ExtraOrange}
                    MAX_SCORE={9e10}
                    bind:value={coral_score_teleop.l3}
                />
                </div>
                <div class="col_div">
                    <label for="_">L4</label>
                    <Incrementor
                    color={ButtonBgColors.ExtraOrange}
                    MAX_SCORE={9e10}
                    bind:value={coral_score_teleop.l4}
                />
                </div>
            {:else}
            <div class="col_div">
                <label for="_">L1</label>
                <Incrementor
                color={ButtonBgColors.ExtraOrange}
                MAX_SCORE={9e10}
                bind:value={coral_score_auto.l1}
            />
            </div>
            <div class="col_div">
                <label for="_">L2</label>
                <Incrementor
                color={ButtonBgColors.ExtraOrange}
                MAX_SCORE={9e10}
                bind:value={coral_score_auto.l2}
            />
            </div>
            <div class="col_div">
                <label for="_">L3</label>
                <Incrementor
                color={ButtonBgColors.ExtraOrange}
                MAX_SCORE={9e10}
                bind:value={coral_score_auto.l3}
            />
            </div>
            <div class="col_div">
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

<style>
    @import "tailwindcss/base";
    @import "tailwindcss/components";
    @import "tailwindcss/utilities";
    laebl {
        @apply text-3xl font-[700];
    }
    @layer components{
        .col_div{
            @apply flex flex-col items-center m-4;
        }
        
    }
</style>
