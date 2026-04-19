<script>

    import {arc, pie} from "d3-shape"

    let {data, selected, backgroundColor} = $props()

    $inspect(data.find((d) => d.name === selected))
	
	const width = 928;
    const height = $derived(width);

  const pieLayout = pie()
		.sort(null)
		.value(d => d.value);

  const arcPath = arc()
		.innerRadius(0)
		.outerRadius(Math.min(width, height) / 2 - 1);

  const labelRadius = arcPath.outerRadius()() * 0.8;

  const arcLabel = arc()
		.innerRadius(labelRadius)
		.outerRadius(labelRadius);

  const arcs = $derived(pieLayout(data))

  function assignColor(i, sliceData) {
    if (i === 0 && sliceData.name !== selected) return 'grey'
    else if (sliceData.name === selected) return 'green'
    else return 'red'
  }

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
