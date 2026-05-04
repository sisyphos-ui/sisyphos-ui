<script setup lang="ts">
import { Carousel } from "@sisyphos-ui/vue";
</script>

<template>
  <div style="max-width: 480px;">
    <Carousel :count="3">
      <div style="display:grid; place-items:center; height:160px; background:linear-gradient(135deg,#ff7022,#ff9a58); color:white; border-radius:12px; font-weight:600; font-size:18px;">
        Slide 1 · React, Vue & Angular
      </div>
    </Carousel>
  </div>
</template>
