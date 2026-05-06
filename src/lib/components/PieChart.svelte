<script>

    import {arc, pie} from "d3-shape"

    let {data, selected, backgroundColor} = $props()
	
	const width = 500;
    const height = $derived(width);

  const pieLayout = pie()
		.sort(null)
		.value(d => d.value);


  const arcPath = $derived(arc()
		.innerRadius(0)
		.outerRadius(Math.min(width, height) / 2 - 1))

  const labelRadius = $derived(arcPath.outerRadius()() * 0.8)

  const arcLabel = $derived(arc()
		.innerRadius(labelRadius)
		.outerRadius(labelRadius))

  const arcs = $derived(pieLayout(data))

  function assignColor(i, sliceData) {
    if (i === 0 && sliceData.name !== selected) return 'grey'
    else if (sliceData.name === selected) return 'green'
    else return 'red'
  }

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


</script>

<svg
  {width}
  {height}
  viewBox="{-width / 2}, {-height / 2}, {width}, {height}"
  style:max-width="100%"
  style:height="auto"
>
	<g class="data">

		{#each arcs as slice, i}
			
			<path 
				d={arcPath(slice)}
				fill={assignColor(i, slice.data)}
				stroke={backgroundColor}
                stroke-width={6}
				/>

			<text
				style="font-weight: bold"
				transform="translate({arcLabel.centroid(slice)})"
				text-anchor="middle"
				>
				{slice.data.name}
			</text>
			
			{#if (slice.endAngle - slice.startAngle) > 0.25}
				<text
					text-anchor="middle"
					transform="translate({[arcLabel.centroid(slice)[0], arcLabel.centroid(slice)[1] + 10]})"
					>
					{slice.data.value.toLocaleString("en-US")}
				</text>
			{/if}
		{/each}
	</g>
</svg>


<style>
	svg {
		font-size: 3em;
	}
</style>
