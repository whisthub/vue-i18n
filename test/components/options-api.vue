<template>
	<div>
		<p class="welcome">{{ $t('welcome') }}</p>
		<p class="bananas">{{ $tc('bananas', 10) }}</p>
		<p class="no-bananas">{{ $tc('bananas', 0) }}</p>
	</div>
</template>

<script>
export default {
	i18n: {
		messages: {
			en: {
				welcome: 'Welcome!',
				bananas: [
					'No bananas',
					'One banana',
					i => i`${'n'} bananas`,
				],
			},
		},
	},
};
</script>
