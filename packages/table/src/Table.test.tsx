import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table } from "./Table";
import { Pagination, getPageItems } from "./Pagination";
import type { TableColumn } from "./types";

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
    render(
      <Table data={rows} columns={columns} rowKey={(r) => r.id} onSortChange={onSortChange} />
    );
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

  it("searchable renders a search input and emits onSearchChange", async () => {
    const onSearchChange = vi.fn();
    render(
      <Table
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        searchable
        onSearchChange={onSearchChange}
      />
    );
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "Ada");
    expect(onSearchChange).toHaveBeenLastCalledWith("Ada");
  });

  it("toolbar slot renders arbitrary content", () => {
    render(
      <Table
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        toolbar={<button data-testid="filter-btn">Filter</button>}
      />
    );
    expect(screen.getByTestId("filter-btn")).toBeInTheDocument();
  });

  it("expandable shows chevron, reveals content on click", async () => {
    render(
      <Table
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        expandable
        renderExpanded={(r) => <div data-testid={`details-${r.id}`}>Details for {r.name}</div>}
      />
    );
    expect(screen.queryByTestId("details-1")).not.toBeInTheDocument();
    const buttons = screen.getAllByRole("button", { name: /expand row/i });
    await userEvent.click(buttons[0]);
    expect(screen.getByTestId("details-1")).toBeInTheDocument();
    expect(screen.getByText("Details for Ada")).toBeInTheDocument();
  });

  it("rowExpandable lets the caller hide the chevron for some rows", () => {
    render(
      <Table
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        expandable
        rowExpandable={(r) => r.id === 1}
        renderExpanded={() => <div>x</div>}
      />
    );
    const buttons = screen.queryAllByRole("button", { name: /expand row/i });
    expect(buttons).toHaveLength(1);
  });

  it("pagination config renders Pagination footer + summary", () => {
    render(
      <Table
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        pagination={{
          page: 1,
          pageCount: 3,
          onPageChange: () => {},
          pageSize: 10,
          total: 23,
        }}
      />
    );
    expect(screen.getByText(/Showing 1–10 of 23/)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("pagination pageSizeOptions renders a page-size selector", async () => {
    const onPageSizeChange = vi.fn();
    render(
      <Table
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        pagination={{
          page: 1,
          pageCount: 10,
          onPageChange: () => {},
          pageSize: 10,
          pageSizeOptions: [10, 25, 50],
          onPageSizeChange,
          total: 100,
        }}
      />
    );
    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "25");
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it("rowSelectionMode=click toggles selection on row click", async () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        selectable
        rowSelectionMode="click"
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      />
    );
    await userEvent.click(screen.getByText("Ada"));
    expect(onSelectionChange).toHaveBeenCalledWith([1]);
  });

  it("rowSelectionMode=doubleClick toggles only on double-click", async () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        selectable
        rowSelectionMode="doubleClick"
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      />
    );
    await userEvent.click(screen.getByText("Ada"));
    expect(onSelectionChange).not.toHaveBeenCalled();
    await userEvent.dblClick(screen.getByText("Volkan"));
    expect(onSelectionChange).toHaveBeenCalledWith([2]);
  });

  it("onRowContextMenu fires on right click with row + index", async () => {
    const onRowContextMenu = vi.fn();
    render(
      <Table
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        onRowContextMenu={onRowContextMenu}
      />
    );
    const user = userEvent.setup();
    await user.pointer({ keys: "[MouseRight]", target: screen.getByText("Ada") });
    expect(onRowContextMenu).toHaveBeenCalled();
    expect(onRowContextMenu.mock.calls[0][1]).toEqual(rows[0]);
    expect(onRowContextMenu.mock.calls[0][2]).toBe(0);
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
