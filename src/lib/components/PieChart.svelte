<script>

    import {arc, pie} from "d3-shape"

    let {data, selected, backgroundColor, containerHeight=$bindable(0), containerWidth=$bindable(0)} = $props()



	function getConnectorPath(arcs, sliceIndex, containerWidth, containerHeight) {
	const svgWidth = 200;
	const svgHeight = 200;
	const containerPadding = 5 * 16; // 5em in pixels (assuming 16px = 1em)
	
	// Calculate which slices are in the top half
	const topSlices = arcs
		.map((arc, idx) => ({
			idx,
			centroid: arcLabel.centroid(arc),
			angle: Math.atan2(arcLabel.centroid(arc)[1], arcLabel.centroid(arc)[0])
		}))
		.filter(s => s.centroid[1] < 0);

	// Helper function to get endpoint at container edge
	const getEndpoint = (isLeft) => {
		const centroid = arcLabel.centroid(arcs[sliceIndex]);
		const angleFromTop = Math.abs(Math.atan2(centroid[0], -centroid[1]) * (180 / Math.PI));
		
		// Direction vector
		const dirX = isLeft ? -1 : 1;
		const dirY = angleFromTop < 45 ? -1 : -1; // Always going up for top slices
		
		// Calculate which edge we'll hit
		const svgEdgeX = isLeft ? -svgWidth / 2 : svgWidth / 2;
		const svgEdgeY = -svgHeight / 2;
		
		// Convert SVG coordinates to container coordinates
		const containerCenterX = containerWidth / 2;
		const containerCenterY = containerHeight / 2;
		const endX = containerCenterX + svgEdgeX;
		const endY = containerCenterY + svgEdgeY;
		
		return { x: endX, y: endY };
	};

	// Helper function to build path with endpoint
	const getAngledPath = (isLeft) => {
		const centroid = arcLabel.centroid(arcs[sliceIndex]);
		const angleFromTop = Math.abs(Math.atan2(centroid[0], -centroid[1]) * (180 / Math.PI));
		const endpoint = getEndpoint(isLeft);
		
		// Convert endpoint back to SVG coordinates relative to centroid
		const containerCenterX = containerWidth / 2;
		const containerCenterY = containerHeight / 2;
		const relEndX = endpoint.x - containerCenterX - centroid[0];
		const relEndY = endpoint.y - containerCenterY - centroid[1];
		
		if (angleFromTop < 45) {
			// Go up first, then out
			return `M0,0 L0,${relEndY * 0.5} L${relEndX},${relEndY}`;
		} else {
			// Go out first, then up
			return `M0,0 L${relEndX * 0.5},0 L${relEndX},${relEndY}`;
		}
	};

	// If two slices in top half, distribute left/right; one in bottom
	if (topSlices.length === 2) {
		const leftmost = topSlices.reduce((a, b) => a.centroid[0] < b.centroid[0] ? a : b);
		const isLeftSlice = sliceIndex === leftmost.idx;
		
		if (isLeftSlice) {
			return getAngledPath(true);
		} else if (topSlices.some(s => s.idx === sliceIndex)) {
			return getAngledPath(false);
		} else {
			return "M0,0 L0,15"; // straight down to bottom
		}
	} else {
		// Evenly distributed
		const paths = [
			getAngledPath(false),  // up and to the right
			"M0,0 L0,15",          // straight down
			getAngledPath(true)    // up and to the left
		];
		return paths[sliceIndex];
	}
}
	
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
}
</style>
