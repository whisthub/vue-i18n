<template>
	<div>
		<div class="bare">{{ t('greeting', ['Whisthub']) }}</div>
		<div class="greeting">
			<i18n-t keypath="greeting">
				<span>Whisthub</span>
			</i18n-t>
		</div>
		<div class="foo"></div>
	</div>
</template>

<script setup>
import { useI18n } from '@whisthub/vue-i18n';
const { t } = useI18n({
	messages: {
		en: {
			greeting: i => i`Hello ${0}!`,
		},
	},
});
</script>
