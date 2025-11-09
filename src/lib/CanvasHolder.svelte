<script lang="ts">
    import { onMount, tick } from "svelte";
    import blurImage from "../modules/blurImage";
    import renderImage from "../modules/renderImage";
    import sharpenImage from "../modules/sharpenImage";
    import downloadImage from "../modules/downloadImage";
    import { fade } from "svelte/transition";

    let canvas: HTMLCanvasElement | null;
    let ctx: CanvasRenderingContext2D;
    let { file = $bindable(null) }: { file: File | null } = $props();

    const applyEffect = () => {
        if (!canvas) return;
        
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        imageData = blurImage(imageData, 5);
        imageData = sharpenImage(imageData, 5);
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    let active = true;
    const maxIterations = 30;
    let iterations = $state(0);
    let isCompleted = $state(false);

    const animate = async () => {
        if (iterations !== maxIterations && iterations !== 0) return;
        iterations = 0;

        for (let i = 0; i < maxIterations; i++) {
            if (!active) break;

			await new Promise(r => setTimeout(r, 1000 / 60));
			applyEffect();
            iterations++;
			await tick();
		}

        if (iterations === maxIterations) {
            isCompleted = true;
        }
    }

    $effect(() => {
		return () => {
			active = false;
		}
	})

    const reset = () => {
        file = null;
    }

    const handleFile = (file: File) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            renderImage(ctx, img);
        }
        img.src = url;
    }

    const download = () => {
        downloadImage(ctx);
    }

    onMount(() => {
        if (!file) return;
        if (canvas) {
            ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        }
        handleFile(file);
    });
</script>

<div
    in:fade
    class="relative mb-8 border border-gray-400 bg-gray-200 dark:border-neutral-500 dark:bg-neutral-800 rounded-2xl p-10 flex items-center"
>
    <canvas
        bind:this={canvas}
        width={1920 / 2.5}
        height={1080 / 2.5}
        class="w-full rounded-2xl"
    ></canvas>

    <button
        onclick={reset}
        aria-label="reset"
        class="absolute top-0 right-0 m-3 flex items-center justify-center"
    >
        <svg
            class="text-neutral-500 hover:text-neutral-400 transition-colors cursor-pointer"
            xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M20.48 3.512a11.97 11.97 0 0 0-8.486-3.514C5.366-.002-.007 5.371-.007 11.999c0 3.314 1.344 6.315 3.516 8.487A11.97 11.97 0 0 0 11.995 24c6.628 0 12.001-5.373 12.001-12.001c0-3.314-1.344-6.315-3.516-8.487m-1.542 15.427a9.8 9.8 0 0 1-6.943 2.876c-5.423 0-9.819-4.396-9.819-9.819a9.8 9.8 0 0 1 2.876-6.943a9.8 9.8 0 0 1 6.942-2.876c5.422 0 9.818 4.396 9.818 9.818a9.8 9.8 0 0 1-2.876 6.942z"/><path fill="currentColor" d="m13.537 12l3.855-3.855a1.091 1.091 0 0 0-1.542-1.541l.001-.001l-3.855 3.855l-3.855-3.855A1.091 1.091 0 0 0 6.6 8.145l-.001-.001l3.855 3.855l-3.855 3.855a1.091 1.091 0 1 0 1.541 1.542l.001-.001l3.855-3.855l3.855 3.855a1.091 1.091 0 1 0 1.542-1.541l-.001-.001z"/></svg>
    </button>
</div>

<div class="w-full flex justify-center items-center gap-4 mt-4">
    <button
        onclick={animate}
        class="w-40 px-5 py-3 bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 text-white font-medium rounded-xl transition-colors cursor-pointer"
        >{isCompleted ? "Continue?" : "Animate"}</button
    >
    
    <span class="font-bold min-w-15 text-center">{iterations}/{maxIterations}</span>

    {#if isCompleted}
        <button
            onclick={download}
            class="w-40 px-5 py-3 self-end bg-rose-700 hover:bg-rose-600 active:bg-rose-800 text-white font-medium rounded-xl transition-colors cursor-pointer"
            >Download</button
        >
    {/if}
</div>