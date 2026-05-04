<script setup lang="ts">
import { ref } from "vue";
import { Tabs, TabsList, TabsTrigger, TabsPanel } from "@sisyphos-ui/vue";

const tab = ref("overview");
</script>

<template>
  <Tabs v-model:value="tab" variant="pill">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
    <TabsPanel value="overview">Overview content.</TabsPanel>
    <TabsPanel value="activity">Activity content.</TabsPanel>
    <TabsPanel value="settings">Settings content.</TabsPanel>
  </Tabs>
</template>
