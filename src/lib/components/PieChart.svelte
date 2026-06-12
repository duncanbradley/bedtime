<script>

    import {arc, pie} from "d3-shape"

    let {data, selected, backgroundColor, positions=$bindable(), containerHeight=$bindable(0), containerWidth=$bindable(0)} = $props()

	const width = 200;
    const height = $derived(width);
	
function getSlicePositions(arcs) {
    const bottomMostSlice = arcs.reduce((closest, current) => {
        const currentY = arcLabel.centroid(current)[1];
        const closestY = arcLabel.centroid(closest)[1];
        return currentY > closestY ? current : closest;
    });
    
    const topSlices = arcs.filter(a => a !== bottomMostSlice);
    const rightMostSlice = topSlices.reduce((rightmost, current) => {
        const currentX = arcLabel.centroid(current)[0];
        const rightmostX = arcLabel.centroid(rightmost)[0];
        return currentX > rightmostX ? current : rightmost;
    });
    
    const bottomIndex = arcs.indexOf(bottomMostSlice);
    const topRightIndex = arcs.indexOf(rightMostSlice);
    const topLeftIndex = arcs.findIndex(a => a !== bottomMostSlice && a !== rightMostSlice);
    
    return { topRightIndex, topLeftIndex, bottomIndex };
}

function getConnectorPath(arcs, sliceIndex, width, height, positions) {
    const arc = arcs[sliceIndex];
    const [positionX, positionY] = arcLabel.centroid(arc);
    
    // Configuration constants
    const BOTTOM_OFFSET = 45;
    const SIDE_MARGIN = 40;
    const VERTICAL_OFFSET = 45;
    const ANGLED_VERTICAL_OFFSET = -30;
    const ANGLE_THRESHOLD = 45;
    
    // Calculate derived values
    const angleFromTop = Math.abs(Math.atan2(positionX, -positionY) * (180 / Math.PI));
    const isSteeplyAngled = angleFromTop >= ANGLE_THRESHOLD;
    
    const isBottomSlice = sliceIndex === positions.bottomIndex;
    
    // Special case: bottom slice goes straight down
    if (isBottomSlice) {
        const verticalDistance = height - positionY - BOTTOM_OFFSET;
        return `M0,0 L0,${verticalDistance}`;
    }
    
    const isRightSlice = sliceIndex === positions.topRightIndex;
    
    // Calculate horizontal offset: right goes right, left goes left
    const hOffset = isRightSlice
        ? width - positionX - SIDE_MARGIN
        : -(width - Math.abs(positionX) - SIDE_MARGIN);
    
    // Route based on angle
    if (!isSteeplyAngled) {
        // Vertical-first path: go down, then horizontal
        const vEnd = -height - positionY + VERTICAL_OFFSET;
        return `M0,0 L0,${vEnd} L${hOffset},${vEnd}`;
    } else {
        // Angled-first path: go horizontal, then down
        const vEnd = -height / 2 - positionY + ANGLED_VERTICAL_OFFSET;
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

positions = getSlicePositions(arcs)

</script>

<div class="svg-wrapper" bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}>

<svg
  width={width/2}
  height={height/2}
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
        stroke-width={3}
	/>

	{#if containerWidth && containerHeight}
		{@const centroid = arcLabel.centroid(slice)}
		{@const pathD = getConnectorPath(arcs, i, width, height, positions)}
		<path
			d={pathD}
			transform="translate({centroid})"
			stroke="aliceblue"
			stroke-width="2"
			fill="none"
            stroke-linejoin="round"
		/>
	{/if}

	
		{/each}
	</g>
</svg>
</div>

<!-- <div style="position:absolute">
    <p>containerHeight: {containerHeight}</p>
<p>containerWidth: {containerWidth}</p>
<p>width: {width}</p>
<p>height: {height}</p>
</div> -->

<style>
	svg {
		font-size: 3em;
		overflow: visible;
        width:200px
	}
	.svg-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
}
p{
    color:aliceblue
}
</style>
