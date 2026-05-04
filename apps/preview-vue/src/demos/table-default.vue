<script setup lang="ts">
import { Table } from "@sisyphos-ui/vue";
import type { TableColumn } from "@sisyphos-ui/vue";

// Vue's runtime prop validation surfaces TableColumn<T> as
// TableColumn<Record<string, unknown>>; we cast at the binding boundary
// so the demo stays idiomatic for consumers.
const data = [
  { id: 1, name: "Volkan Günay", role: "Engineer", status: "active" },
  { id: 2, name: "Ada Lovelace", role: "Mathematician", status: "active" },
  { id: 3, name: "Grace Hopper", role: "Compiler pioneer", status: "active" },
  { id: 4, name: "Alan Turing", role: "Cryptanalyst", status: "active" },
] as unknown as Record<string, unknown>[];

const columns = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "role", header: "Role", accessor: "role", sortable: true },
  { id: "status", header: "Status", accessor: "status" },
] as unknown as TableColumn<Record<string, unknown>>[];

const rowKey = (r: Record<string, unknown>) => r["id"] as number;
</script>

<template>
  <Table :data="data" :columns="columns" :rowKey="rowKey" :striped="true" />
</template>
