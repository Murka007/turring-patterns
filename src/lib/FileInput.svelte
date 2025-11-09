<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";


    let { file = $bindable(null) }: { file: File | null } = $props();

    const handleFile = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files === null || target.files.length === 0 || file) return;

        file = target.files[0];
    }

    let isDragging = $state(false);

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		isDragging = true;
	}

	const handleDragLeave = (event: DragEvent) => {
		event.preventDefault();
		isDragging = false;
	}

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		isDragging = false;
        const data = event.dataTransfer;
        if (data === null || data.files.length === 0 || file) return;
		file = data.files[0];
	}

    onMount(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const data = event.clipboardData;
            if (!data || data.files.length === 0 || file) return;
            file = data.files[0];
        }

        document.addEventListener("paste", handlePaste, { once: true });
        return () => {
            document.removeEventListener("paste", handlePaste);
        }
    })
</script>

<label
    in:fade
    for="file"
    class="mb-8 relative border-3 border-dashed bg-gray-200 dark:border-neutral-500 dark:bg-neutral-800 duration-300 transition-colors rounded-2xl p-16 flex flex-col items-center"
    class:!border-neutral-400={isDragging}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
>
    <svg class="mb-6 text-neutral-500 dark:text-neutral-300" xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24"><path fill="currentColor" d="M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288T20 16v2q0 .825-.587 1.413T18 20zm5-12.15L9.125 9.725q-.3.3-.712.288T7.7 9.7q-.275-.3-.288-.7t.288-.7l3.6-3.6q.15-.15.325-.212T12 4.425t.375.063t.325.212l3.6 3.6q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L13 7.85V15q0 .425-.288.713T12 16t-.712-.288T11 15z"/></svg>
    <h3 class="text-2xl font-bold mb-2">Drop your image</h3>
    <p class="mb-6 text-neutral-600 dark:text-neutral-400">or click below to browse</p>
    <span class="px-5 py-3 bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 transition-colors text-white rounded-lg cursor-pointer">Choose File</span>

    <input accept="image/*" id="file" name="file" type="file" onchange={handleFile} class="hidden" />
</label>