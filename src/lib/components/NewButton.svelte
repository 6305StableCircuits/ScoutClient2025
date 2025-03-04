<!--
@component
Extrastyles prop SHOULD override any classes but you should check, feels like it's not a good idea

-->
<script lang="ts">
  import { ButtonSizes, type ButtonBgColors } from '$lib/ButtonStyles';
	import type { MouseEventHandler } from 'svelte/elements';
	let {
		text,
		func,
		colour,
        size = ButtonSizes.Longest,
		extraStyles = ""
	}: {
		text: string;
		func: MouseEventHandler<HTMLButtonElement>;
		colour: ButtonBgColors;
        size?: ButtonSizes;
		extraStyles?: string;
	} = $props();
	$inspect(text);
	$inspect(colour);
</script>

<button
	onclick={func}
	class="{colour} {size} text-Text button max-w-[402px] m-2 w-[50vw] "
>
	{text}
</button>
