<script lang="ts">

  import PieChart from "../lib/components/PieChart.svelte";
  import GeneralTimePicker03 from "$lib/components/GeneralTimePicker03.svelte";

  let {data} = $props()


 let selected = $state()

 

function slugify(text) {
    try {
        if (typeof text !== 'string') {
            throw new TypeError('Input must be a string');
        }

        return text
            .normalize('NFD')                     // Normalize accented characters
            .replace(/[\u0300-\u036f]/g, '')       // Remove diacritics
            .toLowerCase()                         // Convert to lowercase
            .trim()                                // Remove leading/trailing spaces
            .replace(/[^a-z0-9\s-]/g, '')          // Remove invalid chars
            .replace(/\s+/g, '-')                  // Replace spaces with hyphens
            .replace(/-+/g, '-');                  // Collapse multiple hyphens
    } catch (error) {
        console.error('Slugify error:', error.message);
        return '';
    }
}

</script>

<div class="page">
<div class="content">

<!-- <h1 id="question">
  What time do you go to bed?
    <span>On average</span>
</h1> -->

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
          {slugify(option.Time)}
        </label>
      {/each}
    </div>
  </div>
</form>
{:else}
<div class="selected-option-container">
  <button>Back</button>

<div class="sleep-option selected">{selected}
</div>
</div>
{/if}
<!-- <GeneralTimePicker03></GeneralTimePicker03> -->


<nav aria-label="Related pages">
  <ul>
    {#each data.sleep as option (option.Time)}
    <li><a href={slugify(option.Time)}>{option.Time}</a></li>
    {/each}
  </ul>
</nav>


</div>
</div>

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



