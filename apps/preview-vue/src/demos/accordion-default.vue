<script setup lang="ts">
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@sisyphos-ui/vue";
</script>

<template>
  <Accordion defaultValue="install">
    <AccordionItem value="install">
      <AccordionTrigger>How do I install it?</AccordionTrigger>
      <AccordionContent>
        <code>pnpm add @sisyphos-ui/vue</code> and import the stylesheet once.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="theme">
      <AccordionTrigger>Can I theme it?</AccordionTrigger>
      <AccordionContent>Yes — every token is a CSS variable.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="a11y">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>Every component targets WAI-ARIA practices.</AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
