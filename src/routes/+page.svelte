<script lang="ts">

  import PieChart from "./PieChart.svelte";

  let {data} = $props()

  let backgroundColor = "midnightblue"

  let options = [
		{ id: "x1", text: "option1" },
		{ id: "x2", text: "option2" },
		{ id: "x3", text: "option3" },
    { id: "x4", text: "option4" },
		{ id: "x5", text: "option5" }
	];


function calculateSlices(input, data) {
  const index = data.findIndex(item => item.Time === input);
  if (index === -1) return [];

  const before = data.slice(0, index).reduce((sum, item) => sum + item.Adjusted, 0);
  const chosen = data[index].Adjusted;
  const after  = data.slice(index + 1).reduce((sum, item) => sum + item.Adjusted, 0);

  return [
    { name: "before", value: before },
    { name: data[index].Time, value: chosen },
    { name: "after",  value: after  },
  ].filter(({ value }) => value);
}

 let selected = $state()

 let newSlices = $derived(calculateSlices(selected, data.sleep))

 $inspect({newSlices})

 function generateText(selected, newSlices){
  const beforeText = newSlices[0].value
  const chosenText = newSlices[1].value
  const afterText = newSlices[2].value
  return[beforeText, chosenText, afterText]
 }

 let textArray = $derived(generateText(selected, newSlices))

</script>
<h1>What time do you go to bed?</h1>
<p>On average</p>

<select name="timeSelect" id="timeSelect" bind:value={selected}>
  {#each data.sleep as option}
    <option value={option.Time}>{option.Time}</option>
  {/each}
</select>

<div class="pie-container">
<p class="annotation">Selected: {selected}</p>

{#if newSlices}
<PieChart data={newSlices} {selected} {backgroundColor}/>
{/if}
</div>

<div>
<p class="source">British adults. Excludes 'Don't know'. Source: YouGov (2022)</p>
</div>

<style>

  h1 {
color: aliceblue;
}
  p{
    color: aliceblue;
  }
  .source{
    color: white
  }
  .pie-container{
    position:relative;
  }

  .annotation{
    position:absolute
  }

</style>



