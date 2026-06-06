<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="page">
<div class="content">
<h1 id="question">
  What time do you go to bed?
    <span>On average</span>
</h1>
{@render children()}

</div>
</div>


<style>
  h1 {
color: aliceblue;
font-family: 'Apfel Grotezk Fett'
}

.page{
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
