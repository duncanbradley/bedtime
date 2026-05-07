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
  return template.replace('{value}', Math.round(value));
}

 let descriptions = $state({
  9: 'Only {value}% of people',
  10: 'About one in ten people',
  15: 'About one in seven people',
  20: 'About a fifth of people',
  25: 'About a quarter of people',
  33: 'About a third of people',
  40: 'Just over a third of people',
  45: 'Just less than half of people',
  50: 'About half of people',
  55: 'Just over half of people',
  60: 'Just under two thirds of people',
  67: 'About two thirds of people',
  75: 'About three quarters of people',
  80: 'About four fifths of people',
  85: 'About six in seven people',
  90: 'About nine in ten people',
  91: '{value}% of people',
 })

 function generateText(newSlices){
    let beforeText, chosenText, afterText;

  if (newSlices[0].name !== 'before') {
    console.log('first')
     chosenText = `${findClosest(newSlices[0].value, descriptions)} go to bed at the same time as you`
     afterText = `${findClosest(newSlices[1].value, descriptions)} go to bed later than you`
  }
  else if (newSlices[1].name === 'after') {
        console.log('second')

     beforeText = `${findClosest(newSlices[0].value, descriptions)} go to bed earlier than you`
     chosenText = `${findClosest(newSlices[1].value, descriptions)} go to bed at the same time as you`
  }
  else {
        console.log('third')

     beforeText = `${findClosest(newSlices[0].value, descriptions)} go to bed earlier than you`
     chosenText = `${findClosest(newSlices[1].value, descriptions)} go to bed at the same time as you`
     afterText = `${findClosest(newSlices[2].value, descriptions)} go to bed later than you`
  }

  return [beforeText, chosenText, afterText].filter(item => item !== undefined);

 }

let textArray = $derived(generateText(newSlices))

</script>

<h1>
  What time do you go to bed?
    <span>On average</span>
</h1>
<!-- <GeneralTimePicker03></GeneralTimePicker03> -->

<select name="timeSelect" id="timeSelect" bind:value={selected}>
  {#each data.sleep as option}
    <option value={option.Time}>{option.Time}</option>
  {/each}
</select>

{#if selected}
{#each textArray as text}
 <p>{text}</p>
{/each}

<div class="pie-container">
<PieChart data={newSlices} {selected} {backgroundColor}/>
</div>

<div>
<span class="source">British adults. Excludes 'Don't know'. Source: YouGov (2022)</span>
</div>

{/if}



<style>
 

  h1 {
color: aliceblue;
font-family: 'Apfel Grotezk Fett'

}
  p{
    color: aliceblue;
    font-family: 'Apfel Grotezk Regular'

  }
  span{
    opacity: 0.8;
    font-family: 'Apfel Grotezk Regular';
    font-size: 1.2rem
  }
  .source{
    color: white;
    font-size: 0.8em

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



