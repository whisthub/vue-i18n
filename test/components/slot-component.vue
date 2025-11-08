<template>
	<p>
		<slot name="content"></slot>
	</p>
</template>

<script setup>
import { useI18n } from '@whisthub/vue-i18n';

useI18n({
	messages: {
		en: {
			greeting: i => i`Go away, ${0}`,
		},
		nl: {
			greeting: i => i`Ga weg, ${0}`,
		},
	},
});
</script>
