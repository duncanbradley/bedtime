<script lang="ts">

  import PieChart from "../lib/components/PieChart.svelte";
  import GeneralTimePicker03 from "$lib/components/GeneralTimePicker03.svelte";

  let {data} = $props()

  $inspect(data)

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

 $inspect(newSlices)

 function findClosest(value, descriptions) {
  const thresholds = Object.keys(descriptions).map(Number);
  
  const closestThreshold = thresholds.reduce((closest, current) => {
    return Math.abs(current - value) < Math.abs(closest - value) 
      ? current
      : closest;
  });

  const template = descriptions[closestThreshold];
  return template.replace('{value}', value);
}

 let descriptions = $state({
  9: 'only {value}% of people',
  10: 'about one in ten people',
  15: 'about one in seven people',
  20: 'about a fifth of people',
  25: 'about a quarter of people',
  33: 'about a third of people',
  40: 'just less than half of people',
  50: 'about half of people',
  60: 'just more than half of people',
  67: 'about two thirds of people',
  75: 'about three quarters of people',
  80: 'about four fifths of people',
  85: 'about six in seven people',
  90: 'about nine in ten people',
  91: '{value}% of people',
 })

 function generateText(newSlices){
    let beforeText, chosenText, afterText;

  if (newSlices[0].name !== 'before') {
     chosenText = `${findClosest(newSlices[0].value, descriptions)} go to bed at the same time as you`
     afterText = `${findClosest(newSlices[1].value, descriptions)} go to bed later than you`
  }
  else if (newSlices[1].name !== 'after') {
     beforeText = `${findClosest(newSlices[0].value, descriptions)} go to bed earlier than you`
     chosenText = `${findClosest(newSlices[1].value, descriptions)} go to bed at the same time as you`
  }
  else {
     beforeText = `${findClosest(newSlices[0].value, descriptions)} go to bed earlier than you`
     chosenText = `${findClosest(newSlices[1].value, descriptions)} go to bed at the same time as you`
     afterText = `${findClosest(newSlices[2].value, descriptions)} go to bed later than you`
  }

  return [beforeText, chosenText, afterText].filter(item => item !== undefined);

 }

// let ok = $derived(generateText(newSlices))
let textArray = ["r", "o", "l"]

</script>
<h1>What time do you go to bed?</h1>
<p>On average</p>
<!-- <GeneralTimePicker03></GeneralTimePicker03> -->

<select name="timeSelect" id="timeSelect" bind:value={selected}>
  {#each data.sleep as option}
    <option value={option.Time}>{option.Time}</option>
  {/each}
</select>

{#each textArray as text}
 <p>{text}</p>
{/each}

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
font-family: 'Apfel Grotezk Fett'

}
  p{
    color: aliceblue;
    font-family: 'Apfel Grotezk Regular'

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

  @font-face {
    font-family: 'Apfel Grotezk Fett';
    src: url('/fonts/ApfelGrotezk-Fett.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap; /* Optional: improves loading performance */
}

 @font-face {
    font-family: 'Apfel Grotezk Regular';
    src: url('/fonts/ApfelGrotezk-Regular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap; /* Optional: improves loading performance */
}

</style>



