<script lang="ts">
  let { data } = $props();

  function slugify(text) {
    try {
      if (typeof text !== "string") {
        throw new TypeError("Input must be a string");
      }

      return text
        .normalize("NFD") // Normalize accented characters
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .toLowerCase() // Convert to lowercase
        .trim() // Remove leading/trailing spaces
        .replace(/[^a-z0-9\s-]/g, "") // Remove invalid chars
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Collapse multiple hyphens
    } catch (error) {
      console.error("Slugify error:", error.message);
      return "";
    }
  }
</script>

<nav >
  <ul class="sleep-options">
    {#each data.sleep as option (option.Time)}
      <li >
        <a class="sleep-option" href={slugify(option.Time)}>{option.Time}</a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .sleep-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.3rem;
    margin-top: 1rem;
    list-style-type: none;
    padding: 0em;
  }

  .sleep-option {
    padding: 0.5rem 1rem;
    display: block;
    border: 2px solid aliceblue;
    border-radius: 0.5rem;
    color: aliceblue;
    font-family: "Apfel Grotezk Regular";
    font-size: 1em;
  }

  .sleep-option:hover {
    background: #f7fafc;
    color: #2d2727;
  }

  @font-face {
    font-family: "Apfel Grotezk Fett";
    src: url("/fonts/ApfelGrotezk-Fett.otf") format("opentype");
    font-weight: normal;
    font-style: normal;
    font-display: swap; /* Optional: improves loading performance */
  }

  @font-face {
    font-family: "Apfel Grotezk Regular";
    src: url("/fonts/ApfelGrotezk-Regular.otf") format("opentype");
    font-weight: normal;
    font-style: normal;
    font-display: swap; /* Optional: improves loading performance */
  }
</style>
