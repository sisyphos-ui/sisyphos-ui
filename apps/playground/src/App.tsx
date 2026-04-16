import { useState } from "react";
import "@sisyphos-ui/ui/styles.css";
import {
  Accordion,
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  DropdownMenu,
  EmptyState,
  Input,
  Popover,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  SkeletonText,
  Slider,
  Spinner,
  Switch,
  Tabs,
  Textarea,
  Toaster,
  Tooltip,
  toast,
} from "@sisyphos-ui/ui";
import "./App.css";

const Section: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <section className="showcase-section">
    <div className="showcase-section-head">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
    <div className="showcase-section-body">{children}</div>
  </section>
);

export default function App() {
  const [tab, setTab] = useState("overview");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [swChecked, setSwChecked] = useState(true);
  const [plan, setPlan] = useState<string | number>("pro");
  const [country, setCountry] = useState<string | number | null>("tr");
  const [volume, setVolume] = useState(50);

  return (
    <div className="page">
      <Toaster position="bottom-right" />

      <header className="hero">
        <Chip variant="soft" color="primary" size="sm">v0.2.0 — initial public release</Chip>
        <h1>Sisyphos UI</h1>
        <p>
          A modern, accessible, themeable React component library. Thirty-plus components that
          ship as independent, tree-shakable packages — built on CSS variables, strict TypeScript,
          and zero runtime dependencies beyond React.
        </p>
        <div className="hero-actions">
          <Button onClick={() => toast.success("Welcome to Sisyphos UI")}>Try a toast</Button>
          <Button variant="outlined" onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <Button variant="text" href="https://github.com/sisyphos-ui/sisyphos-ui">
            GitHub →
          </Button>
        </div>
      </header>

      <main className="page-body">
        <Section title="Buttons" description="Four variants × five semantic colors × five sizes.">
          <div className="row">
            {(["contained", "outlined", "soft", "text"] as const).map((v) => (
              <Button key={v} variant={v}>
                {v}
              </Button>
            ))}
          </div>
          <div className="row">
            {(["primary", "success", "error", "warning", "info"] as const).map((c) => (
              <Button key={c} color={c}>
                {c}
              </Button>
            ))}
          </div>
          <div className="row">
            <Button size="sm">small</Button>
            <Button>default</Button>
            <Button size="lg">large</Button>
            <Button loading>loading</Button>
            <Button disabled>disabled</Button>
          </div>
        </Section>

        <Section title="Form fields" description="Label + error + helper wiring is built in.">
          <div className="grid-2">
            <Input label="Email" type="email" placeholder="name@example.com" />
            <Input label="Password" type="password" defaultValue="secret123" />
            <Textarea label="Bio" placeholder="Tell us a bit about yourself…" maxLength={140} showCharacterCount />
            <Select
              label="Country"
              value={country}
              onChange={setCountry}
              clearable
              searchable
              options={[
                { value: "tr", label: "Türkiye" },
                { value: "us", label: "United States" },
                { value: "de", label: "Germany" },
                { value: "fr", label: "France" },
                { value: "jp", label: "Japan" },
              ]}
            />
          </div>
          <div className="row">
            <Checkbox checked={checked} onChange={setChecked} label="I agree to the terms" />
            <Switch checked={swChecked} onChange={setSwChecked} aria-label="Notifications" />
          </div>
          <RadioGroup label="Plan" value={plan} onChange={setPlan} variant="card">
            <Radio value="free" label="Free" description="All the basics, forever." />
            <Radio value="pro" label="Pro" description="For growing teams." />
            <Radio value="enterprise" label="Enterprise" description="Dedicated support." />
          </RadioGroup>
        </Section>

        <Section title="Feedback" description="Toasts, alerts, skeletons, empty states.">
          <div className="row">
            <Button onClick={() => toast.success("Saved")}>Success toast</Button>
            <Button color="error" onClick={() => toast.error("Something went wrong")}>Error toast</Button>
            <Button color="warning" onClick={() => toast.warning("Heads up")}>Warning toast</Button>
          </div>
          <div className="grid-2">
            <Alert color="success" title="All set" description="Your settings have been saved." />
            <Alert color="warning" title="Storage almost full" description="Upgrade or clean up." onClose={() => {}} />
          </div>
          <Card>
            <Card.Header>Loading state</Card.Header>
            <Card.Body>
              <div className="skeleton-row">
                <Skeleton shape="circular" width={48} height={48} />
                <div style={{ flex: 1, display: "grid", gap: 8 }}>
                  <Skeleton width="60%" height={16} />
                  <SkeletonText lines={2} />
                </div>
              </div>
            </Card.Body>
          </Card>
          <EmptyState
            bordered
            title="Nothing here yet"
            description="Once you create an item it'll show up here."
            actions={<Button>New item</Button>}
          />
        </Section>

        <Section title="Overlays" description="Focus-trapped, keyboard-operable, portal-mounted.">
          <div className="row">
            <Tooltip content="⌘K to search">
              <Button variant="outlined">Hover me</Button>
            </Tooltip>
            <Popover content={<div>Popovers carry rich interactive content.</div>}>
              <Button variant="outlined">Popover</Button>
            </Popover>
            <DropdownMenu
              items={[
                { label: "Edit", onSelect: () => toast("Edit") },
                { label: "Duplicate", onSelect: () => toast("Duplicate") },
                { type: "separator" },
                { label: "Delete", destructive: true, onSelect: () => toast.error("Deleted") },
              ]}
            >
              <Button variant="outlined">Actions ▾</Button>
            </DropdownMenu>
            <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
          </div>
        </Section>

        <Section title="Navigation & data" description="Tabs, breadcrumbs, sliders, avatars.">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/projects" },
              { label: "Sisyphos UI" },
            ]}
          />
          <Tabs value={tab} onValueChange={setTab} variant="pill">
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
              <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Panel value="overview">Overview content.</Tabs.Panel>
            <Tabs.Panel value="activity">Activity content.</Tabs.Panel>
            <Tabs.Panel value="settings">Settings content.</Tabs.Panel>
          </Tabs>
          <Slider value={volume} onChange={setVolume} ariaLabel="Volume" showValue />
          <div className="row">
            <Avatar name="Volkan Günay" color="primary" />
            <Avatar name="Ada Lovelace" color="info" />
            <Avatar name="Grace Hopper" color="success" />
            <Spinner />
            <Spinner variant="double" color="info" size="lg" />
          </div>
        </Section>

        <Section title="Disclosure" description="Single or multi-expand accordion.">
          <Accordion defaultValue="install">
            <Accordion.Item value="install">
              <Accordion.Trigger>How do I install it?</Accordion.Trigger>
              <Accordion.Content>
                <code>pnpm add @sisyphos-ui/ui</code> and import the stylesheet once.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="theme">
              <Accordion.Trigger>Can I theme it?</Accordion.Trigger>
              <Accordion.Content>
                Yes — every token is a CSS variable. Use <code>applyTheme()</code> at runtime or
                override <code>--sisyphos-*</code> in CSS.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="a11y">
              <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
              <Accordion.Content>
                Every component targets the WAI-ARIA Authoring Practices and is tested with
                keyboard + screen-reader expectations.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Section>
      </main>

      <footer className="footer">
        <span>MIT © Sisyphos UI Contributors</span>
        <a href="https://github.com/sisyphos-ui/sisyphos-ui">GitHub</a>
        <a href="https://www.npmjs.com/package/@sisyphos-ui/ui">npm</a>
      </footer>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} size="md">
        <Dialog.Header>
          <Dialog.Title>Ship it</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <Dialog.Description>
            Every Sisyphos dialog traps focus, locks body scroll, and restores focus on close.
            No config needed.
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="outlined" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => { setDialogOpen(false); toast.success("Shipped"); }}>
            Ship
          </Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}
