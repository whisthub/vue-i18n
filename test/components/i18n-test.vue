<template>
	<div>
		<p class="fragment">
			<i18n-t keypath="greeting">
				<span>Whisthub</span>
			</i18n-t>
		</p>
		<i18n-t tag="p" class="tag" keypath="greeting">
			<b>{{ t('stranger') }}</b>
		</i18n-t>
		<i18n-t tag="p" class="named" keypath="named">Whisthub</i18n-t>
		<i18n-t
			tag="p"
			class="plural"
			keypath="bananas"
			:plural="count"
		>
			<template #n>
				<b>{{ count }}</b>
			</template>
		</i18n-t>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from '@whisthub/vue-i18n';

const { t } = useI18n({
	messages: {
		en: {
			greeting: i => i`Hello ${0}!`,
			stranger: 'stranger',
			named: i => i`Hello ${'name'}!`,
		},
		nl: {
			named: i => i`Hallo ${'name'}!`,
			bananas: [
				i => i`Geen bananen`,
				i => i`Eén banaan`,
				i => i`${'n'} bananen`,
			],
		},
	},
});

const count = ref(0);

function increment() {
	count.value = count.value + 1;
}

defineExpose({ increment });
</script>
