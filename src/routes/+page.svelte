<script lang="ts">

  import PieChart from "../lib/components/PieChart.svelte";
  import GeneralTimePicker03 from "$lib/components/GeneralTimePicker03.svelte";

  let {data} = $props()

  $inspect(data)

  let backgroundColor = "#2d2727"

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
  11: 'Just over a tenth of people',
  19: 'Just under a fifth of people',
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
  81: 'Just over four fifths of people',
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

<div class="page">
<div class="content">

<h1 id="question">
  What time do you go to bed?
    <span>On average</span>
</h1>

{#if !selected}
<form>
  <div role="radiogroup" aria-labelledby="question">

    <div class="sleep-options">
      {#each data.sleep as option (option.Time)}
        <label class="sleep-option">
          <input
            type="radio"
            name="bedtime"
            value={option.Time}
            bind:group={selected}
          />
          {option.Time}
        </label>
      {/each}
    </div>
  </div>
</form>

{/if}
<!-- <GeneralTimePicker03></GeneralTimePicker03> -->


 {#if selected}

 <!-- up to 10pm, use L+R for first two labels -->
 <!-- between, use center for main label -->
<!-- from around midnight, use R+L for first two label -->


<div class="pie-container" bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}>
<PieChart data={newSlices} {selected} {backgroundColor}/>
<div  class="annotation top-left">
<span>{textArray[2]}</span>
</div>
<div  class="annotation bottom-centre">
<span>{textArray[1]}</span>
</div>
<div  class="annotation top-right">
<span>{textArray[0]}</span>
</div>

</div>
<div>
<span class="source">British adults. Excludes 'Don't know'. Source: YouGov (2022)</span>
</div>

{/if}
</div>
</div>

<style>

.page{
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content{
}

  h1 {
color: aliceblue;
font-family: 'Apfel Grotezk Fett'

}
  p{
    color: aliceblue;
    font-family: 'Apfel Grotezk Regular'

  }
  span{
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
    font-size: 0.8em;
         text-align: right
  }
  .pie-container {
    position: relative;
    padding: 5em;
    border: 1px solid;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1em;
}

  .annotation {
    position: absolute;
    max-width: 10em;
}

.annotation.top-right {
    top: 1em;
    right: 1em;
     text-align: right
}

.annotation.top-left {
    top: 1em;
    left: 1em;
     text-align: left
}

.annotation.bottom-centre {
    bottom: 1em;
    left: 50%;
    transform: translateX(-50%);
     text-align: center;
         max-width: 12em;

}

 .sleep-options {
    display: flex;
    /* flex-direction: column; */
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .sleep-option {
    padding: 0.75rem 1.5rem;
    border: 2px solid aliceblue;
    border-radius: 0.5rem;
    cursor: pointer;
    color: aliceblue;
    font-family: 'Apfel Grotezk Regular';
    font-size: 1em
  }

  .sleep-option:hover {
    background: #f7fafc;
        color:#2d2727;

  }

  input{
    display:none
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



