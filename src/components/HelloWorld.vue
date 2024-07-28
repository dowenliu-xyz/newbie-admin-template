<script setup lang="ts">
import { ref } from "vue";
import { ElButton, ElIcon } from "element-plus";
import { InfoFilled, SuccessFilled, WarningFilled, WarnTriangleFilled } from "@element-plus/icons-vue";
import variables from "@/styles/variables.module.scss";

console.log(variables.bgColor);

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">Vue Docs Scaling up Guide</a>.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  <div>
    <el-button type="success">
      <el-icon>
        <success-filled />
      </el-icon>
      Success
    </el-button>
    <el-button type="info">
      <el-icon>
        <info-filled />
      </el-icon>
      Info
    </el-button>
    <el-button type="warning">
      <el-icon>
        <warning-filled />
      </el-icon>
      Warning
    </el-button>
    <el-button type="danger">
      <el-icon>
        <warn-triangle-filled />
      </el-icon>
      Danger
    </el-button>
  </div>
  <div>
    <div class="box"></div>
    <div style="width: 100px; height: 100px" :style="{ 'background-color': variables.bgColor }" />
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>

<style scoped lang="scss">
.box {
  width: 100px;
  height: 100px;
  background-color: $bg-color;
}
</style>
