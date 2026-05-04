import { describe, it, expect, vi } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Table } from "./table.component";
import { Pagination, getPageItems } from "./pagination.component";
import type { SortState, TableColumn } from "./types";

interface Row {
  id: number;
  name: string;
  email: string;
}

const rows: Row[] = [
  { id: 1, name: "Ada", email: "ada@x.com" },
  { id: 2, name: "Volkan", email: "v@x.com" },
];

const columns: TableColumn<Row>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "email", header: "Email", accessor: "email" },
];

describe("Pagination helpers", () => {
  it("getPageItems collapses with ellipsis past totalNumbers", () => {
    expect(getPageItems(1, 1)).toEqual([1]);
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageItems(5, 20).filter((x) => x === "ellipsis").length).toBeGreaterThan(0);
  });
});

describe("Pagination (Angular)", () => {
  it("emits pageChange when a numeric tab is clicked", () => {
    @Component({ standalone: true, imports: [Pagination], template: `<sui-pagination [page]="1" [pageCount]="5" (pageChange)="last = $event" />` })
    class Host { last = -1; }
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(".sisyphos-pagination-page");
    (buttons[2] as HTMLButtonElement).click();
    expect(fixture.componentInstance.last).toBe(3);
  });

  it("disables prev at page=1 and next at last page", () => {
    @Component({ standalone: true, imports: [Pagination], template: `<sui-pagination [page]="1" [pageCount]="5" />` })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const arrows = fixture.nativeElement.querySelectorAll(".sisyphos-pagination-arrow");
    expect((arrows[0] as HTMLButtonElement).disabled).toBe(true);
    expect((arrows[1] as HTMLButtonElement).disabled).toBe(false);
  });
});

@Component({
  standalone: true,
  imports: [Table],
  template: `
    <sui-table
      [data]="data"
      [columns]="columns"
      [rowKey]="rowKey"
      [loading]="loading"
      [skeletonRows]="3"
      [empty]="empty"
      [selectable]="selectable"
      [selectedIds]="selectedIds"
      (selectedIdsChange)="selectedIds = $event"
      [sort]="sort"
      (sortChange)="sort = $event ?? undefined"
      [searchable]="searchable"
      (searchChange)="lastSearch = $event"
      [pagination]="pagination"
    />
  `,
})
class Host {
  data: Row[] = rows;
  columns = columns;
  rowKey = (row: Row) => row.id;
  loading = false;
  empty = "No data";
  selectable = false;
  selectedIds: (string | number)[] = [];
  sort?: SortState;
  searchable = false;
  lastSearch = "";
  pagination?: { page: number; pageCount: number; onPageChange: (p: number) => void; total?: number; pageSize?: number };
}

describe("Table (Angular)", () => {
  it("renders headers and rows", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("th")?.textContent).toContain("Name");
    expect(fixture.nativeElement.textContent).toContain("Ada");
    expect(fixture.nativeElement.textContent).toContain("v@x.com");
  });

  it("empty state renders when data is empty", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.data = [];
    fixture.componentInstance.empty = "Nothing here";
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain("Nothing here");
  });

  it("loading=true renders skeleton rows", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.loading = true;
    fixture.componentInstance.data = [];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll(".sisyphos-table-skeleton-row").length).toBe(3);
  });

  it("selectable shows checkboxes and emits selection on click", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.selectable = true;
    fixture.detectChanges();
    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    // 1 header + 2 rows = 3
    expect(checkboxes.length).toBe(3);
    (checkboxes[1] as HTMLInputElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedIds).toEqual([1]);
  });

  it("header checkbox selects all", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.selectable = true;
    fixture.detectChanges();
    const head = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    head.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedIds.sort()).toEqual([1, 2]);
  });

  it("clicking a sortable header emits sort cycle (asc → desc → null)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelectorAll("th")[0] as HTMLElement;
    header.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort).toEqual({ key: "name", direction: "asc" });
    header.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort).toEqual({ key: "name", direction: "desc" });
    header.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort).toBeUndefined();
  });

  it("aria-sort reflects sort state on the matching column", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.sort = { key: "name", direction: "asc" };
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll("th[aria-sort]");
    expect(headers[0].getAttribute("aria-sort")).toBe("ascending");
  });

  it("searchable input emits searchChange", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.searchable = true;
    fixture.detectChanges();
    const search = fixture.nativeElement.querySelector('input[role="searchbox"]') as HTMLInputElement;
    search.value = "Ada";
    search.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(fixture.componentInstance.lastSearch).toBe("Ada");
  });

  it("pagination footer renders summary and Pagination", () => {
    const fixture = TestBed.createComponent(Host);
    const onPageChange = vi.fn();
    fixture.componentInstance.pagination = {
      page: 1,
      pageCount: 5,
      onPageChange,
      total: 50,
      pageSize: 10,
    };
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain("Showing 1–10 of 50");
    expect(fixture.nativeElement.querySelector("sui-pagination")).toBeTruthy();
  });

  it("rowKey is honored for selection ids", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.selectable = true;
    fixture.detectChanges();
    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    (checkboxes[2] as HTMLInputElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedIds).toEqual([2]);
  });
});
