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

  // less than 5% of people
  // <10 less than a tenth of people 
  // 10 only about a tenth of people
  // 15 about one in seven people
  // 20 about a fifth of people
  // 25 about a quarter of people
  // 33 about a third of people
  // 40 slightly less than half of people
  // 50 about half of people
  // 60 slightly more than half of people
  // 67 about two thirds of people
  // 75 about three quarters of people
  // 80 about four fifths of people
  // 85 
  // 90 
  // 95

  function describeNumber(number) {
    if (number < .1) {
      return `only ${number*100}%`
    } else if (number < 22.5) {
      return `about a fifth`
    } else if (number < 29) {
      return `about a quarter`
    } else if (number < 33) {
      return `about a third`
    } else if (number < 33) {
      return `about a third`
    } else {
      return `${number*100}%`
    }
  }


 function generateText(selected, newSlices){
  if (newSlices[0].name !== 'before') {
    // const chosenText = `About ${newSlices[0].value} go to bed at the same time as you`
    // const afterText = `About ${newSlices[1].value} go to bed later than you`
  }
  else if (newSlices[1].name !== 'after') {
    // const beforeText = `About ${newSlices[0].value} go to bed earlier than you`
    // const chosenText = `About ${newSlices[1].value} go to bed at the same time as you`
  }
  else{
     // const beforeText = `About ${newSlices[0].value} go to bed earlier than you`
  // const chosenText = `About ${newSlices[1].value} go to bed at the same time as you`
  // const afterText = `About ${newSlices[2].value} go to bed later than you`
  }


  // return[beforeText, chosenText, afterText]
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



