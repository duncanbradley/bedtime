<script>

    import {arc, pie} from "d3-shape"

    let {data, selected, backgroundColor} = $props()
	
	const width = 200;
    const height = $derived(width);

  const pieLayout = pie()
		.sort(null)
		.value(d => d.value);


  const arcPath = $derived(arc()
		.innerRadius(0)
		.outerRadius(Math.min(width, height) / 2 - 1))

  const labelRadius = $derived(arcPath.outerRadius()() * 1)

  const arcLabel = $derived(arc()
		.innerRadius(labelRadius)
		.outerRadius(labelRadius)
	.cornerRadius(15)
.padAngle(50))

		$inspect({arcLabel})

  const arcs = $derived(pieLayout(data))

  function assignColor(i, sliceData) {
    if (i === 0 && sliceData.name !== selected) return '#116bab'
    else if (sliceData.name === selected) return '#16913a'
    else return '#e2b540'
  }


function getPointOnArc(slice, radius) {
  const midAngle = (slice.startAngle + slice.endAngle) / 2;
  return [
    Math.cos(midAngle) * radius,
    Math.sin(midAngle) * radius
  ];
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
                // stroke-width={width/50}
				/>

	 {@const centroid = arcLabel.centroid(slice)}
    <path
      d={centroid[0] < 0
          ? centroid[1] < 0
            ? "M0,0 L-5,0 L-5,-10 L5,-10 L5,-15"  // Top-left
            : "M0,0 L-5,0 L-5,10 L5,10 L5,15"     // Bottom-left
          : centroid[1] < 0
            ? "M0,0 L5,0 5,-10 L-5,-10 L-5,-15"   // Top-right
            : "M0,0 L5,0 5,10 L-5,10 L-5,15"}     // Bottom-right
      transform="translate({centroid})"
      stroke="aliceblue"
      stroke-width="1"
      fill="none"
    />

			 <!-- <text
				style="font-weight: bold"
				transform="translate({arcLabel.centroid(slice)})"
				text-anchor="middle"
				>
				x
			</text>  -->
			
			<!-- {#if (slice.endAngle - slice.startAngle) > 0.25}
				<text
					text-anchor="middle"
					transform="translate({[arcLabel.centroid(slice)[0], arcLabel.centroid(slice)[1] + 10]})"
					>
					{slice.data.value.toLocaleString("en-US")}
				</text>
			{/if} -->
		{/each}
	</g>
</svg>


<style>
	svg {
		font-size: 3em;
		overflow: visible;
	}
</style>
