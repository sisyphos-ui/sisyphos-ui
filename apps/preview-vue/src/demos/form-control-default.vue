<script setup lang="ts">
import { FormControl, FormLabel, FormHelperText, Input } from "@sisyphos-ui/vue";
</script>

<template>
  <FormControl>
    <FormLabel>Email</FormLabel>
    <Input type="email" placeholder="name@example.com" />
    <FormHelperText>We'll never share your email.</FormHelperText>
  </FormControl>
</template>
