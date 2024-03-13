<script lang="ts" setup>
import {useFetch} from "nuxt/app";
import {faker} from "@faker-js/faker";
import {useContextHeaders, useNuxtApp} from "#imports";

const {$databaseModule} = useNuxtApp();

const {
	execute,
	data,
	pending,
} = useFetch('/api/test', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		...$databaseModule.getContextHeaders('core')
	},
	immediate: false,
	onRequest(context) {
		context.options.body = generateRandomCar();
	}
});

const {
	execute: executeMultiTenancy,
	data: multiTenancyData,
	pending: multiTenancyPending,
} = useFetch('/api/test', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		...$databaseModule.getContextHeaders('tenant', '65b23bf98f24acdf2bdc6f7f')
	},
	immediate: false,
	onRequest(context) {
		context.options.body = generateRandomCar();
	}
});

function generateRandomCar() {
	return {
		model: faker.vehicle.model(),
		manufacturer: faker.vehicle.manufacturer(),
		type: faker.vehicle.type(),
	};
}
</script>

<template>
	<h1>@antify/database-module</h1>

	<div>
		This playground send a simple http request to the server which uses the @antify/database-module.
	</div>

	<br>

	<div style="display: flex; gap: 1rem;">
		<div>
			<button @click="() => execute()">Add car to single-tenancy</button>

			<h3>Response</h3>

			<pre v-if="!pending">{{ data }}</pre>
		</div>

		<div>
			<button @click="() => executeMultiTenancy()">Add car to multi-tenancy</button>

			<h3>Response</h3>

			<pre v-if="!multiTenancyPending">{{ multiTenancyData }}</pre>
		</div>
	</div>

	<br>

	<h3>Context Headers from useContextHeaders composable</h3>
	<pre>{{ useContextHeaders('foo', '0815') }}</pre>

	<br>

	<h3>Context Headers from $databaseModule plugin</h3>
	<pre>{{ $databaseModule.getContextHeaders('foo', '0815') }}</pre>
</template>
