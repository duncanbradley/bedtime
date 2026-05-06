<!-- @free -->
<!-- @medium -->
<!-- @description Custom time select dropdowns -->
<!-- Custom time select dropdowns -->
<!-- from https://sveltoui.dev/elements/time-picker-->
<script>
	let hours = $state("12");
	let minutes = $state("00");
	let period = $state("PM");

	const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
	const minuteOptions = ["00","30"];
</script>

<div class="flex items-center justify-center p-8">
	<div class="flex items-center gap-1">
		<select
			bind:value={hours}
			aria-label="Hours"
			class="h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
		>
			{#each hourOptions as hour}
				<option value={hour}>{hour}</option>
			{/each}
		</select>
		<span class="text-xl font-bold" aria-hidden="true">:</span>
		<select
			bind:value={minutes}
			aria-label="Minutes"
			class="h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
		>
			{#each minuteOptions as minute}
				<option value={minute}>{minute}</option>
			{/each}
		</select>
		<!-- <select
			bind:value={period}
			aria-label="Time period"
			class="h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
		>
			<option value="AM">AM</option>
			<option value="PM">PM</option>
		</select> -->
	</div>
</div>
