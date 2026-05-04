/**
 * Vitest setup for Angular components.
 *
 * Bootstraps the testing TestBed environment once per test process. Uses the
 * dynamic platform so we can use TestBed.createComponent() without the AOT
 * compiler.
 */
import "@analogjs/vitest-angular/setup-zone";

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { getTestBed } from "@angular/core/testing";

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  teardown: { destroyAfterEach: true },
});
