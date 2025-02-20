<script lang="ts">
  import { ButtonSizes, type ButtonBgColors } from '$lib/ButtonStyles';
	import type { MouseEventHandler } from 'svelte/elements';
	let {
		text,
		func,
		colour,
        size = ButtonSizes.Longest
	}: {
		text: string;
		func: MouseEventHandler<HTMLButtonElement>;
		colour: ButtonBgColors;
        size?: ButtonSizes;
	} = $props();
	$inspect(text);
	$inspect(colour);
</script>

<button
	onclick={func}
	class="{colour} {size} text-Text button "
>
	{text}
</button>
