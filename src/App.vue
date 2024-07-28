<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import { useCounterStore } from "@/store/counter";
import { ElButton } from "element-plus";
const counterStore = useCounterStore();
</script>
<template>
  <h1 class="text-3xl">父组件</h1>
  <el-button type="primary" @click="counterStore.increment">count++</el-button>
  <HelloWorld />
</template>
