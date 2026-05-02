import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Table } from "./Table";
import { Pagination } from "./Pagination";
import type { SortState, TableColumn } from "./types";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "disabled";
}

const allUsers: User[] = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "Admin" : "Member",
  status: i % 4 === 0 ? "invited" : i % 7 === 0 ? "disabled" : "active",
}));

const columns: TableColumn<User>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "email", header: "Email", accessor: "email" },
  { id: "role", header: "Role", accessor: "role", sortable: true },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    align: "center",
    render: (u) => (
      <span
        style={{
          background:
            u.status === "active" ? "#dcfce7" : u.status === "invited" ? "#cffafe" : "#fee2e2",
          color: u.status === "active" ? "#15803d" : u.status === "invited" ? "#0891b2" : "#dc2626",
          borderRadius: 4,
          padding: "2px 8px",
          fontSize: 12,
        }}
      >
        {u.status}
      </span>
    ),
  },
];

const meta: Meta<typeof Table<User>> = {
  title: "Components/Table",
  component: Table<User>,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Table<User>>;

export const Default: Story = {
  render: () => <Table data={allUsers.slice(0, 6)} columns={columns} rowKey={(u) => u.id} />,
};

export const Sortable: Story = {
  render: () => {
    const [sort, setSort] = useState<SortState | null>({ key: "name", direction: "asc" });
    const sorted = [...allUsers].sort((a, b) => {
      if (!sort) return 0;
      const va = (a as any)[sort.key];
      const vb = (b as any)[sort.key];
      return (va > vb ? 1 : va < vb ? -1 : 0) * (sort.direction === "asc" ? 1 : -1);
    });
    return (
      <Table
        data={sorted.slice(0, 8)}
        columns={columns}
        rowKey={(u) => u.id}
        sort={sort ?? undefined}
        onSortChange={setSort}
      />
    );
  },
};

export const Selectable: Story = {
  render: () => {
    const [sel, setSel] = useState<(string | number)[]>([]);
    return (
      <Table
        data={allUsers.slice(0, 6)}
        columns={columns}
        rowKey={(u) => u.id}
        selectable
        selectedIds={sel}
        onSelectionChange={setSel}
      />
    );
  },
};

export const Loading: Story = {
  render: () => <Table data={[]} columns={columns} loading skeletonRows={6} />,
};

export const Empty: Story = {
  render: () => <Table data={[]} columns={columns} empty="Hiç kayıt yok" />,
};

export const WithPagination: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const pageSize = 6;
    const total = allUsers.length;
    const slice = allUsers.slice((page - 1) * pageSize, page * pageSize);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Table data={slice} columns={columns} rowKey={(u) => u.id} hoverable striped />
        <Pagination page={page} pageCount={Math.ceil(total / pageSize)} onPageChange={setPage} />
      </div>
    );
  },
};

export const TruncatedColumns: Story = {
  name: "Truncated columns",
  render: () => {
    const longRows: User[] = [
      {
        id: 1,
        name: "A very long name that almost certainly does not fit inside its column",
        email: "this-is-a-rather-long-mailbox-address@example-corporation.co.uk",
        role: "Admin",
        status: "active",
      },
      ...allUsers.slice(0, 4),
    ];
    const truncCols: TableColumn<User>[] = [
      { id: "name", header: "Name", accessor: "name", truncate: true, width: 180 },
      { id: "email", header: "Email", accessor: "email", truncate: true, width: 200 },
      { id: "role", header: "Role", accessor: "role" },
    ];
    return <Table data={longRows} columns={truncCols} rowKey={(u) => u.id} bordered />;
  },
};

export const RowClassName: Story = {
  name: "Highlighted rows via rowClassName",
  render: () => (
    <Table
      data={allUsers.slice(0, 6)}
      columns={columns}
      rowKey={(u) => u.id}
      rowClassName={(u) => (u.status === "disabled" ? "row-disabled" : undefined)}
    />
  ),
};

export const LoadingDelay: Story = {
  name: "Loading with delay (smooths flicker)",
  render: () => {
    const [loading, setLoading] = useState(true);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={() => setLoading((l) => !l)} style={{ alignSelf: "start" }}>
          Toggle loading (currently {String(loading)})
        </button>
        <Table
          data={loading ? [] : allUsers.slice(0, 4)}
          columns={columns}
          rowKey={(u) => u.id}
          loading={loading}
          loadingDelay={400}
          skeletonRows={4}
        />
      </div>
    );
  },
};
