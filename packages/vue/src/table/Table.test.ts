import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Table from "./Table.vue";

const columns = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "email", header: "Email", accessor: "email" },
];

const data = [
  { name: "Ada", email: "ada@x.com" },
  { name: "Volkan", email: "v@x.com" },
];

describe("Table (Vue)", () => {
  it("renders headers and rows", () => {
    const wrapper = mount(Table, { props: { data, columns } });
    expect(wrapper.find("th").text()).toContain("Name");
    expect(wrapper.text()).toContain("Ada");
    expect(wrapper.text()).toContain("v@x.com");
  });

  it("empty state renders message", () => {
    const wrapper = mount(Table, { props: { data: [], columns, empty: "Nothing here" } });
    expect(wrapper.text()).toContain("Nothing here");
  });

  it("loading renders skeleton rows", () => {
    const wrapper = mount(Table, { props: { data: [], columns, loading: true, skeletonRows: 3 } });
    expect(wrapper.findAll(".sisyphos-table-skeleton-row").length).toBe(3);
  });

  it("selectable shows checkboxes and emits selection", async () => {
    const wrapper = mount(Table, {
      props: { data, columns, selectable: true, selectedIds: [] },
    });
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    // header + 2 row checkboxes
    expect(checkboxes.length).toBe(3);
    await checkboxes[1].trigger("change");
    expect(wrapper.emitted("update:selectedIds")).toBeTruthy();
  });

  it("clicking sortable header emits update:sort", async () => {
    const wrapper = mount(Table, { props: { data, columns } });
    const header = wrapper.find("th");
    await header.trigger("click");
    const emitted = wrapper.emitted("update:sort");
    expect(emitted).toBeTruthy();
    expect((emitted![0][0] as { direction: string }).direction).toBe("asc");
  });

  it("pagination renders when config provided", () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns,
        pagination: {
          page: 1,
          pageCount: 5,
          onPageChange: () => {},
          total: 50,
          pageSize: 10,
        },
      },
    });
    expect(wrapper.find(".sisyphos-pagination").exists()).toBe(true);
    expect(wrapper.text()).toContain("Showing 1–10 of 50");
  });

  it("searchable renders search input and emits update:searchValue", async () => {
    const wrapper = mount(Table, { props: { data, columns, searchable: true } });
    const input = wrapper.find('input[role="searchbox"]');
    expect(input.exists()).toBe(true);
    await input.setValue("Ada");
    expect(wrapper.emitted("update:searchValue")?.[0]?.[0]).toBe("Ada");
  });
});
