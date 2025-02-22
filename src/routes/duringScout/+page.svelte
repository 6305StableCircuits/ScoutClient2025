<script lang="ts">
    import { page } from '$app/stores';
    
    let scoutName = $page.url.searchParams.get("name");
</script>

<p bind:textContent={scoutName} contenteditable="true"></p>