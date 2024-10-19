<style>
    span{
        background-image: repeating-linear-gradient(45deg, violet, indigo, blue, green, yellow, orange, red, violet);
        text-align: center;
        background-size: 800% 800%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: rainbow 8s ease infinite;
    }
    @keyframes rainbow {
        0% {
            background-position: 0% 50%
        }

        50% {
            background-position: 100% 25%
        }

        100% {
            background-position: 0% 50%
        }
    }
</style>
<script lang="ts">
    import type {Props} from '$lib/types';
    let {children}:Props = $props();
</script>
<!--
@component
Makes any text inside it rainbow. 
```svelte
<Rainbow>This is rainbow text!</Rainbow>
```
-->
<span>{@render children?.()}</span>