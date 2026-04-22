<script lang="ts">

  import PieChart from "./PieChart.svelte";

  let backgroundColor = "midnightblue"

  let options = [
		{ id: "x1", text: "option1" },
		{ id: "x2", text: "option2" },
		{ id: "x3", text: "option3" }
	];

  let data = [
  {
    "name": "x1",
    "value": 20
  },
  {
    "name": "x2",
    "value": 35
  },
  {
    "name": "x3",
    "value": 45
  },
]

 let selected = $state()

</script>

<h1>What time do you go to bed?</h1>
<p>On average</p>

<select name="cars" id="cars" bind:value={selected}>
  {#each options as option}
    <option value={option.id}>{option.text}</option>
  {/each}
</select>

<div class="pie-container">
<p class="annotation">{selected}</p>
<PieChart {data} {selected} {backgroundColor}/>
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



