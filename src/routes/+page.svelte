<script lang="ts">

  import PieChart from "./PieChart.svelte";

  let backgroundColor = "midnightblue"

  let options = [
		{ id: "x1", text: "option1" },
		{ id: "x2", text: "option2" },
		{ id: "x3", text: "option3" },
    { id: "x4", text: "option4" },
		{ id: "x5", text: "option5" }
	];

  let data = [
  {
    "name": "x1",
    "value": 15
  },
  {
    "name": "x2",
    "value": 25
  },
  {
    "name": "x3",
    "value": 30
  },
  {
    "name": "x4",
    "value": 20
  },
  {
    "name": "x5",
    "value": 10
  },
]

function calculateSlices(input) {
  const index = data.findIndex(item => item.name === input);
  if (index === -1) return [];

  const before = data.slice(0, index).reduce((sum, item) => sum + item.value, 0);
  const chosen = data[index].value;
  const after  = data.slice(index + 1).reduce((sum, item) => sum + item.value, 0);

  return [
    { name: "before", value: before },
    { name: data[index].name, value: chosen },
    { name: "after",  value: after  },
  ].filter(({ value }) => value);
}

 let selected = $state()

 let newSlices = $derived(calculateSlices(selected))

</script>

<h1>What time do you go to bed?</h1>
<p>On average</p>

<select name="timeSelect" id="timeSelect" bind:value={selected}>
  {#each options as option}
    <option value={option.id}>{option.text}</option>
  {/each}
</select>

<div class="pie-container">
<p class="annotation">Selected: {selected}</p>
{#each newSlices as slice}
<p>{slice.name}:{slice.value}%</p>
{/each}

{#if newSlices}
<PieChart data={newSlices} {selected} {backgroundColor}/>
{/if}
</div>

<div>
<p class="source">British adults. Excludes 'Don't know'. Source: YouGov (2022)</p>
</div>

<style>
  h1{
    color: aliceblue;
  }
  p{
    color: aliceblue;
  }
  .source{
    color: white
  }
  .pie-container{
    position:relative
  }

  .annotation{
    position:absolute
  }

</style>



