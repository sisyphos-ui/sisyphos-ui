import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table } from "./Table";
import { Pagination, getPageItems } from "./Pagination";
import type { TableColumn } from "./types";

interface Row { id: number; name: string; email: string }
const rows: Row[] = [
  { id: 1, name: "Ada", email: "ada@x.com" },
  { id: 2, name: "Volkan", email: "v@x.com" },
];
const columns: TableColumn<Row>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "email", header: "Email", accessor: "email" },
];

describe("Table", () => {
  it("renders headers and rows", () => {
    render(<Table data={rows} columns={columns} rowKey={(r) => r.id} />);
    expect(screen.getByRole("columnheader", { name: /Name/ })).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("v@x.com")).toBeInTheDocument();
  });

  it("emits selection changes", async () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        selectable
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      />
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Select row 1" }));
    expect(onSelectionChange).toHaveBeenCalledWith([1]);
  });

  it("clicking sortable header emits sort cycle", async () => {
    const onSortChange = vi.fn();
    render(<Table data={rows} columns={columns} rowKey={(r) => r.id} onSortChange={onSortChange} />);
    const header = screen.getByRole("columnheader", { name: /Name/ });
    await userEvent.click(header);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: "name", direction: "asc" });
  });

  it("loading renders skeleton rows", () => {
    render(<Table data={[]} columns={columns} loading skeletonRows={3} />);
    const skeletonCells = document.querySelectorAll(".sisyphos-table-skeleton");
    expect(skeletonCells.length).toBeGreaterThan(0);
  });

  it("empty renders empty message", () => {
    render(<Table data={[]} columns={columns} empty="Hiçbir şey" />);
    expect(screen.getByText("Hiçbir şey")).toBeInTheDocument();
  });

  it("clickable row fires onRowClick", async () => {
    const onRowClick = vi.fn();
    render(<Table data={rows} columns={columns} rowKey={(r) => r.id} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText("Ada"));
    expect(onRowClick).toHaveBeenCalledWith(rows[0], 0);
  });
});

describe("Pagination", () => {
  it("getPageItems compresses with ellipsis", () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageItems(5, 20)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 20]);
  });

  it("renders page numbers + arrows", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("disables prev on first page", () => {
    render(<Pagination page={1} pageCount={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });
});
