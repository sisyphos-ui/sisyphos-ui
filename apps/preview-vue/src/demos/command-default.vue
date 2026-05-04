<script setup lang="ts">
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@sisyphos-ui/vue";
</script>

<template>
  <div style="max-width: 360px;">
    <Command label="Command menu">
      <CommandInput placeholder="Type a command…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="new-file">New file</CommandItem>
          <CommandItem value="open-recent">Open recent…</CommandItem>
          <CommandItem value="theme">Toggle theme</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </div>
</template>
