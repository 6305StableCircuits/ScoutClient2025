<script lang="ts">
    type Props = {
        /**
         * The label for your input.
         */
        label?: string;
        /**
         * A bindable value for your input.
         */
        value?: string;
        /**
         * Extra classes for your input for styling or other purposes.
         */
        class?: string;
        /**
         * A placeholder for your input.
         */
        placeholder?: string;
        [name: string]: any;
    };
    let {
        label = '',
        value = $bindable(''),
        class: className = '',
        placeholder = '',
        type = 'text',
        //@ts-ignore
        ...props
        //@ts-ignore
    }: Props = $props();
    const _for = $props.id();
</script>

<!--
@component This is an input. Use it instead of `<input type="text">`.
-->
<main>
    {#if label.length > 0}<label class="mx-1 text-lg" for={_for}>{label}</label>{/if}<input
        id={_for}
        {type}
        {...props}
        {placeholder}
        bind:value
        class="transition-all border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    /><!--class="transition-all rounded border-[0.1em] border-white outline-none hover:border-[0.15em] focus:border-[0.2em] focus:border-slate-100" />-->
</main>
