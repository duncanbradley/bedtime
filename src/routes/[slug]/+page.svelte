<script>
    import { page } from '$app/state';
    import PieChart from '$lib/components/PieChart.svelte';

    let {data} = $props()

    function formatString(str) {
  if (!str) return str;

  let result = str
    .replace(/-/g, ' ')
    .replace(/3/g, '.3');

  return result.charAt(0).toUpperCase() + result.slice(1);
}

let selected = formatString(page.params.slug)
let positions = $state()

let backgroundColor = "#2d2727"


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

let newSlices = $derived(calculateSlices(selected, data.sleep))

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
  9: '<strong>{value}%</strong> of people',
  10: 'About <strong>one in ten</strong> people',
  11: 'Over a <strong>tenth</strong> of people',
  19: 'Just under a <strong>fifth</strong> of people',
  20: 'About a <strong>fifth</strong> of people',
  25: 'About a <strong>quarter</strong> of people',
  33: 'About a <strong>third</strong> of people',
  40: 'Over a <strong>third</strong> of people',
  45: 'Less than <strong>half</strong> of people',
  50: 'About <strong>half</strong> of people',
  55: 'Over <strong>half</strong> of people',
  60: 'Just under <strong>two thirds</strong> of people',
  67: 'About <strong>two thirds</strong> of people',
  75: 'About <strong>three quarters</strong> of people',
  80: 'About <strong>four fifths</strong> of people',
  85: 'About <strong>six in seven</strong> people',  
  90: 'About <strong>nine in ten</strong> people',
  91: '<strong>{value}%</strong> of people',
 })

 function generateText(newSlices){
    let beforeText, chosenText, afterText;

  if (newSlices[0].name !== 'before') {
    console.log('first')
     chosenText = `${findClosest(newSlices[0].value, descriptions)} go to bed at <strong>the same time</strong> as you`
     afterText = `${findClosest(newSlices[1].value, descriptions)} go to bed <strong>later</strong> than you`
  }
  else if (newSlices[1].name === 'after') {
        console.log('second')

     beforeText = `${findClosest(newSlices[0].value, descriptions)} go to bed <strong>earlier</strong> than you`
     chosenText = `${findClosest(newSlices[1].value, descriptions)} go to bed at <strong>the same time</strong> as you`
  }
  else {
        console.log('third')

     beforeText = `${findClosest(newSlices[0].value, descriptions)} go to bed <strong>earlier</strong> than you`
     chosenText = `${findClosest(newSlices[1].value, descriptions)} go to bed at <strong>the same time</strong> as you`
     afterText = `${findClosest(newSlices[2].value, descriptions)} go to bed <strong>later</strong> than you`
  }

  return [beforeText, chosenText, afterText].filter(item => item !== undefined);

 }

let textArray = $derived(generateText(newSlices))
  </script>
  
  <h1>{selected}</h1>

  {#if selected}

  <!-- up to 10pm, use L+R for first two labels -->
  <!-- between, use center for main label -->
 <!-- from around midnight, use R+L for first two label -->
 
 
 <div class="pie-container">
 <PieChart data={newSlices} {selected} {backgroundColor} bind:positions />
 {#if positions}
 <div  class="annotation top-left">
 <span class="annotation-text">{@html textArray[positions.topLeftIndex]}</span>
 </div>
 <div  class="annotation bottom-centre">
 <span class="annotation-text">{@html textArray[positions.bottomIndex]}</span>
 </div>
 <div  class="annotation top-right">
 <span class="annotation-text">{@html textArray[positions.topRightIndex]}</span>
 </div>
 {/if}
 
 </div>
 <div>
 <span class="source">British adults. Excludes 'Don't know'. Source: YouGov (2022)</span>
 </div>
 
 {/if}

<style>

    .page{
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
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
        padding: 5em 5em 6.5em 5em;
        border: 1px solid;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1em;
    }
    
      .annotation {
        position: absolute;
        max-width: 6em;
    
    }
    
    .annotation-text{
          font-size: 0.8em;
    
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
             max-width: 14em;
    
    }
    
     .sleep-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        margin-top: 1rem;
      }
    
      .sleep-option {
        padding: 0.5rem 1rem;
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
      .sleep-option selected {
    
    
      }
    
      .selected-option-container{
        display:flex;
        align-items: center;
        gap: 1em
      }
    
      input{
        display:none
      }
    
      a:link {
      color: aliceblue;
      background-color: transparent;
      text-decoration: none;
    }
    
    a:visited {
      color: aliceblue;
      background-color: transparent;
      text-decoration: none;
    }
    
    a:hover {
      color: aliceblue;
      background-color: transparent;
      text-decoration: underline;
    }
    
    a:active {
      color: lightskyblue;
      background-color: transparent;
      text-decoration: underline;
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
    
    
    
    