<script>

    import {arc, pie} from "d3-shape"

    let {data, selected, backgroundColor, containerHeight=$bindable(0), containerWidth=$bindable(0)} = $props()

	const width = 200;
    const height = $derived(width);

function getConnectorPath(arcs, sliceIndex, containerWidth, containerHeight) {
	const centroid = arcLabel.centroid(arcs[sliceIndex]);
	  $inspect({centroid, containerWidth})

	  const positionX = centroid[0]
	  const positionY = centroid[1]
	  console.log('containerWidth', containerWidth)
	  console.log('containerHeight', containerHeight)
	  console.log('positionX', positionX)
	  console.log('positionY', positionY)

	
	// Count how many slices have centroids in the top half (y < 0)
	const topSliceCount = arcs.filter(arc => arcLabel.centroid(arc)[1] < 0).length;
	const isInTopHalf = centroid[1] < 0;
	const isOnRight = centroid[0] > 0
	
	// If 2 slices in top half and this slice is in bottom, go straight down
	if (topSliceCount === 2 && !isInTopHalf) {
		return `M0,0 L0,${height-(positionY)-55}`;
	}
	
	// Calculate the angle from the top (0° = straight up)
	const angleFromTop = Math.abs(Math.atan2(centroid[0], -centroid[1]) * (180 / Math.PI));
	
	// Choose path style based on angle
	const isSteeplyAngled = angleFromTop >= 45;
	const pathType = isSteeplyAngled ? 'angled-first' : 'vertical-first';
	
	// Build the path
	if (pathType === 'vertical-first') {
		return `M0,0 L0,${centroid[1]} L${centroid[0]},${centroid[1]}`;
	} else {
		return `M0,0 L${centroid[0]},0 L${centroid[0]},${centroid[1]}`;
	}
}
	
	

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

  const arcs = $derived(pieLayout(data))

  function assignColor(i, sliceData) {
    if (i === 0 && sliceData.name !== selected) return '#116bab'
    else if (sliceData.name === selected) return '#16913a'
    else return '#e2b540'
  }

</script>

<div class="svg-wrapper" bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}>

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
	/>

	{#if containerWidth && containerHeight}
		{@const centroid = arcLabel.centroid(slice)}
		{@const pathD = getConnectorPath(arcs, i, containerWidth, containerHeight)}
		<path
			d={pathD}
			transform="translate({centroid})"
			stroke="aliceblue"
			stroke-width="1"
			fill="none"
		/>
	{/if}

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
</div>

<style>
	svg {
		font-size: 3em;
		overflow: visible;
	}
	.svg-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
}
</style>
