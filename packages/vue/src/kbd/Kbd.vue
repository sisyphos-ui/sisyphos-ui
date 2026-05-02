<script setup lang="ts">
/**
 * Kbd — Vue 3 binding. Three input modes (default slot, `keys` array,
 * or `shortcut` string), platform-aware `mod` resolution.
 */
import { computed } from "vue";

interface Props {
  variant?: "outlined" | "soft";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Explicit list of keys. Aliases (cmd/ctrl/shift/...) are normalized to glyphs. */
  keys?: string[];
  /** Shortcut string parsed on `+` or whitespace. e.g. "cmd+k", "ctrl shift p". */
  shortcut?: string;
  /** Visual separator between keys when multiple. */
  separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "outlined",
  size: "sm",
});

const KEY_GLYPHS: Record<string, string> = {
  cmd: "⌘",
  command: "⌘",
  meta: "⌘",
  ctrl: "⌃",
  control: "⌃",
  alt: "⌥",
  option: "⌥",
  opt: "⌥",
  shift: "⇧",
  enter: "↵",
  return: "↵",
  tab: "⇥",
  backspace: "⌫",
  delete: "⌦",
  esc: "⎋",
  escape: "⎋",
  space: "␣",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
  pageup: "⇞",
  pagedown: "⇟",
  home: "↖",
  end: "↘",
};

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform || "");
}

function normalizeKey(raw: string, mac: boolean): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  if (lower === "mod") return mac ? KEY_GLYPHS.cmd : KEY_GLYPHS.ctrl;
  if (KEY_GLYPHS[lower]) return KEY_GLYPHS[lower];
  return trimmed.length === 1 ? trimmed.toUpperCase() : trimmed;
}

const resolvedKeys = computed<string[]>(() => {
  if (props.keys?.length) return props.keys;
  if (props.shortcut) return props.shortcut.split(/[\s+]+/).filter(Boolean);
  return [];
});

const mac = isMac();
const rootClasses = computed(() => ["sisyphos-kbd", props.variant, props.size]);
</script>

<template>
  <kbd v-if="resolvedKeys.length === 0" :class="rootClasses">
    <slot />
  </kbd>
  <span v-else :class="rootClasses" role="group">
    <template v-for="(raw, i) in resolvedKeys" :key="`${raw}-${i}`">
      <span v-if="i > 0 && separator" class="sisyphos-kbd-separator" aria-hidden="true">
        {{ separator }}
      </span>
      <kbd class="sisyphos-kbd-key">{{ normalizeKey(raw, mac) }}</kbd>
    </template>
  </span>
</template>

<style src="./Kbd.scss"></style>
