<script setup lang="ts">
import { ref } from "vue";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
  DialogDescription,
  DialogFooter,
} from "@sisyphos-ui/vue";

const open = ref(false);
</script>

<template>
  <Button @click="open = true">Open dialog</Button>
  <Dialog v-model:open="open" size="md">
    <DialogHeader>
      <DialogTitle>Ship it</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>
      <DialogDescription>
        Every Sisyphos dialog traps focus, locks body scroll, and restores focus on close.
      </DialogDescription>
    </DialogBody>
    <DialogFooter>
      <Button variant="outlined" @click="open = false">Cancel</Button>
      <Button @click="open = false">Ship</Button>
    </DialogFooter>
  </Dialog>
</template>
