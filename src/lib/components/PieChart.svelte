<script>

    import {arc, pie} from "d3-shape"

    let {data, selected, backgroundColor, containerHeight=$bindable(0), containerWidth=$bindable(0)} = $props()

	const width = 200;
    const height = $derived(width);
	
function getConnectorPath(arcs, sliceIndex, containerWidth, containerHeight) {
    const arc = arcs[sliceIndex];
    const [positionX, positionY] = arcLabel.centroid(arc);
    
    // Configuration constants
    const BOTTOM_OFFSET = 55;
    const SIDE_MARGIN = 40;
    const VERTICAL_OFFSET = 45;
    const ANGLED_VERTICAL_OFFSET = 20;
    const ANGLE_THRESHOLD = 45;
    
    // Calculate derived values
    const angleFromTop = Math.abs(Math.atan2(positionX, -positionY) * (180 / Math.PI));
    const isSteeplyAngled = angleFromTop >= ANGLE_THRESHOLD;
    
    // Find the slice closest to bottom
    const bottomMostSlice = arcs.reduce((closest, current) => {
        const currentY = arcLabel.centroid(current)[1];
        const closestY = arcLabel.centroid(closest)[1];
        return currentY > closestY ? current : closest;
    });
    
    const isBottomMostSlice = arc === bottomMostSlice;
    
    // Special case: bottom-most slice goes straight down
    if (isBottomMostSlice) {
        const verticalDistance = containerHeight - positionY - BOTTOM_OFFSET;
        return `M0,0 L0,${verticalDistance}`;
    }
    
    // Find the rightmost slice among the top two (excluding bottom-most)
    const topSlices = arcs.filter(a => a !== bottomMostSlice);
    const rightMostSlice = topSlices.reduce((rightmost, current) => {
        const currentX = arcLabel.centroid(current)[0];
        const rightmostX = arcLabel.centroid(rightmost)[0];
        return currentX > rightmostX ? current : rightmost;
    });
    
    const isRightMostSlice = arc === rightMostSlice;
    
    // Calculate horizontal offset: rightmost goes right, leftmost goes left
    const hOffset = isRightMostSlice
        ? containerWidth - positionX - SIDE_MARGIN
        : -(containerWidth - Math.abs(positionX) - SIDE_MARGIN);
    
    // Route based on angle
    if (!isSteeplyAngled) {
        // Vertical-first path: go down, then horizontal
        const vEnd = -containerHeight - positionY + VERTICAL_OFFSET;
        return `M0,0 L0,${vEnd} L${hOffset},${vEnd}`;
    } else {
        // Angled-first path: go horizontal, then down
        const vEnd = -containerHeight / 2 - positionY + ANGLED_VERTICAL_OFFSET;
        return `M0,0 L${hOffset},0 L${hOffset},${vEnd}`;
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
			fill="RED"
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
