<script setup lang="ts">
import { ref } from "vue";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  CardHeader,
  CardBody,
  Checkbox,
  Chip,
  DatePicker,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DropdownMenu,
  EmptyState,
  Input,
  Popover,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Table,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsPanel,
  Textarea,
  Toaster,
  Tooltip,
  toast,
} from "@sisyphos-ui/vue";
import type { TableColumn } from "@sisyphos-ui/vue";

const tab = ref("overview");
const dialogOpen = ref(false);
const checked = ref(true);
const swChecked = ref(true);
const plan = ref<string | number>("pro");
const country = ref<string | number | null>("tr");
const volume = ref(50);
const date = ref<Date | null>(new Date());

const tableRows = [
  { id: 1, name: "Volkan Günay", role: "Engineer", status: "active" },
  { id: 2, name: "Ada Lovelace", role: "Mathematician", status: "active" },
  { id: 3, name: "Grace Hopper", role: "Compiler pioneer", status: "active" },
  { id: 4, name: "Alan Turing", role: "Cryptanalyst", status: "active" },
];
type Row = (typeof tableRows)[number];
const tableColumns: TableColumn<Row>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "role", header: "Role", accessor: "role", sortable: true },
  { id: "status", header: "Status", accessor: "status" },
];
const rowKey = (r: Row) => r.id;
</script>

<template>
  <div class="page">
    <Toaster position="bottom-right" />

    <header class="hero">
      <Chip variant="soft" color="primary" size="sm">v1.0 — Vue 3 binding</Chip>
      <h1>Sisyphos UI — Vue 3</h1>
      <p>Sisyphos UI components rendered through @sisyphos-ui/vue.</p>
      <div class="hero-actions">
        <Button @click="toast.success('Welcome to Sisyphos UI Vue')">Try a toast</Button>
        <Button variant="outlined" @click="dialogOpen = true">Open dialog</Button>
      </div>
    </header>

    <main class="page-body">
      <section class="showcase-section">
        <h2>Buttons</h2>
        <div class="row">
          <Button v-for="v in ['contained', 'outlined', 'soft', 'text'] as const" :key="v" :variant="v">{{ v }}</Button>
        </div>
        <div class="row">
          <Button v-for="c in ['primary', 'success', 'error', 'warning', 'info'] as const" :key="c" :color="c">{{ c }}</Button>
        </div>
        <div class="row">
          <Button size="sm">small</Button>
          <Button>default</Button>
          <Button size="lg">large</Button>
          <Button :loading="true">loading</Button>
          <Button :disabled="true">disabled</Button>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Form fields</h2>
        <div class="grid-2">
          <Input label="Email" type="email" placeholder="name@example.com" />
          <Input label="Password" type="password" defaultValue="secret123" />
          <Textarea label="Bio" placeholder="Tell us a bit about yourself…" :maxLength="140" :showCharacterCount="true" />
          <Select
            label="Country"
            v-model="country"
            :clearable="true"
            :searchable="true"
            :options="[
              { value: 'tr', label: 'Türkiye' },
              { value: 'us', label: 'United States' },
              { value: 'de', label: 'Germany' },
              { value: 'fr', label: 'France' },
            ]"
          />
        </div>
        <div class="row">
          <Checkbox v-model:checked="checked" label="I agree to the terms" />
          <Switch v-model:checked="swChecked" aria-label="Notifications" />
        </div>
        <RadioGroup label="Plan" v-model:value="plan" variant="card">
          <Radio value="free" label="Free" description="All the basics, forever." />
          <Radio value="pro" label="Pro" description="For growing teams." />
          <Radio value="enterprise" label="Enterprise" description="Dedicated support." />
        </RadioGroup>
      </section>

      <section class="showcase-section">
        <h2>Feedback</h2>
        <div class="row">
          <Button @click="toast.success('Saved')">Success toast</Button>
          <Button color="error" @click="toast.error('Something went wrong')">Error toast</Button>
        </div>
        <div class="grid-2">
          <Alert color="success" title="All set" description="Your settings have been saved." />
          <Alert color="warning" title="Storage almost full" description="Upgrade or clean up." />
        </div>
        <Card>
          <CardHeader>Loading state</CardHeader>
          <CardBody>
            <div style="display: flex; gap: 12px; align-items: center;">
              <Skeleton shape="circular" :width="48" :height="48" />
              <div style="flex: 1; display: grid; gap: 8px;">
                <Skeleton width="60%" :height="16" />
                <Skeleton width="80%" :height="14" />
                <Skeleton width="40%" :height="14" />
              </div>
            </div>
          </CardBody>
        </Card>
        <EmptyState
          :bordered="true"
          title="Nothing here yet"
          description="Once you create an item it'll show up here."
        >
          <template #actions>
            <Button>New item</Button>
          </template>
        </EmptyState>
      </section>

      <section class="showcase-section">
        <h2>Overlays</h2>
        <div class="row">
          <Tooltip content="⌘K to search">
            <Button variant="outlined">Hover me</Button>
          </Tooltip>
          <Popover>
            <Button variant="outlined">Popover</Button>
            <template #content>
              <div>Popovers carry rich interactive content.</div>
            </template>
          </Popover>
          <DropdownMenu
            :items="[
              { label: 'Edit', onSelect: () => toast('Edit') },
              { label: 'Duplicate', onSelect: () => toast('Duplicate') },
              { type: 'separator' },
              { label: 'Delete', destructive: true, onSelect: () => toast.error('Deleted') },
            ]"
          >
            <Button variant="outlined">Actions ▾</Button>
          </DropdownMenu>
          <Button @click="dialogOpen = true">Open dialog</Button>
        </div>
      </section>

      <section class="showcase-section">
        <h2>Navigation & data</h2>
        <Breadcrumb
          :items="[
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: 'Sisyphos UI' },
          ]"
        />
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
        <Slider v-model="volume" ariaLabel="Volume" :showValue="true" />
        <div class="row">
          <Avatar name="Volkan Günay" color="primary" />
          <Avatar name="Ada Lovelace" color="info" />
          <Avatar name="Grace Hopper" color="success" />
          <Spinner />
          <Spinner variant="double" color="info" size="lg" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Data table</h2>
        <Table
          :data="tableRows"
          :columns="tableColumns"
          :rowKey="rowKey"
          :striped="true"
        />
      </section>

      <section class="showcase-section">
        <h2>DatePicker</h2>
        <DatePicker v-model="date" />
      </section>

      <section class="showcase-section">
        <h2>Disclosure</h2>
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
        </Accordion>
      </section>
    </main>

    <Dialog v-model:open="dialogOpen" size="md">
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
        <Button variant="outlined" @click="dialogOpen = false">Cancel</Button>
        <Button @click="dialogOpen = false; toast.success('Shipped')">Ship</Button>
      </DialogFooter>
    </Dialog>
  </div>
</template>

<style>
body { margin: 0; font-family: system-ui, sans-serif; }
.page { max-width: 960px; margin: 0 auto; padding: 32px; }
.hero { padding: 48px 0; }
.hero h1 { font-size: 32px; margin: 12px 0; }
.hero-actions { display: flex; gap: 12px; margin-top: 16px; }
.showcase-section { margin: 24px 0; padding: 24px; border-radius: 12px; background: #f9fafb; }
.showcase-section h2 { font-size: 20px; margin: 0 0 12px; }
.row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin: 12px 0; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 12px 0; }
</style>
