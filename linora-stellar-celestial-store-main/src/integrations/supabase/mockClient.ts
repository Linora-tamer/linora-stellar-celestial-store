/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_PAYMENT_METHODS,
  SEED_SETTINGS,
  SEED_PORTFOLIO_PROJECTS,
} from "./mockData";

// Local storage key for persistent orders in browser if available
const STORAGE_PREFIX = "linora_mock_";

function loadTable<T>(name: string, fallback: T[]): T[] {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(STORAGE_PREFIX + name);
      if (stored) return JSON.parse(stored) as T[];
    } catch {
      // fallback
    }
  }
  return [...fallback];
}

function saveTable<T>(name: string, data: T[]) {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(data));
    } catch {
      // ignore
    }
  }
}

// In-memory tables
const tables: Record<string, any[]> = {
  categories: [...SEED_CATEGORIES],
  products: [...SEED_PRODUCTS],
  payment_methods: [...SEED_PAYMENT_METHODS],
  portfolio_projects: [...SEED_PORTFOLIO_PROJECTS],
  site_settings: Object.entries(SEED_SETTINGS).map(([key, value]) => ({ key, value })),
  orders: loadTable("orders", []),
  custom_orders: loadTable("custom_orders", []),
  contact_messages: loadTable("contact_messages", []),
  addresses: loadTable("addresses", []),
  profiles: [],
  user_roles: [],
};

class MockQueryBuilder {
  private tableName: string;
  private isSingle = false;
  private filters: Array<(row: any) => boolean> = [];
  private orderField?: string;
  private orderAscending = true;
  private limitCount?: number;
  private pendingInsertData?: any;
  private pendingUpdateData?: any;
  private isDelete = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(_cols?: string) {
    return this;
  }

  order(field: string, opts?: { ascending?: boolean }) {
    this.orderField = field;
    this.orderAscending = opts?.ascending ?? true;
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push((row: any) => row[field] === value);
    return this;
  }

  limit(n: number) {
    this.limitCount = n;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  insert(data: any) {
    this.pendingInsertData = data;
    return this;
  }

  update(data: any) {
    this.pendingUpdateData = data;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  private execute() {
    const list = tables[this.tableName] || [];

    if (this.isDelete) {
      const remaining = list.filter((row) => !this.filters.every((f) => f(row)));
      tables[this.tableName] = remaining;
      saveTable(this.tableName, remaining);
      return { data: null, error: null };
    }

    if (this.pendingInsertData) {
      const items = Array.isArray(this.pendingInsertData)
        ? this.pendingInsertData
        : [this.pendingInsertData];
      const insertedList: any[] = [];

      for (const item of items) {
        const id = item.id || `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        let orderNumber = item.order_number;
        if (this.tableName === "orders" && !orderNumber) {
          orderNumber = `LS-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
        }
        const newRecord = {
          ...item,
          id,
          ...(orderNumber ? { order_number: orderNumber } : {}),
          created_at: new Date().toISOString(),
        };
        list.push(newRecord);
        insertedList.push(newRecord);
      }
      saveTable(this.tableName, list);

      if (this.isSingle) {
        return { data: insertedList[0] ?? null, error: null };
      }
      return { data: insertedList, error: null };
    }

    if (this.pendingUpdateData) {
      let updatedCount = 0;
      for (const row of list) {
        const match = this.filters.every((f) => f(row));
        if (match) {
          Object.assign(row, this.pendingUpdateData);
          updatedCount++;
        }
      }
      saveTable(this.tableName, list);
      return { data: list, error: null, count: updatedCount };
    }

    let result = [...list];
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    if (this.orderField) {
      const f = this.orderField;
      const asc = this.orderAscending ? 1 : -1;
      result.sort((a, b) => {
        if (a[f] < b[f]) return -1 * asc;
        if (a[f] > b[f]) return 1 * asc;
        return 0;
      });
    }

    if (this.limitCount !== undefined) {
      result = result.slice(0, this.limitCount);
    }

    if (this.isSingle) {
      return { data: result[0] ?? null, error: null };
    }

    return { data: result, error: null };
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.execute()).then(onfulfilled, onrejected);
  }
}

export function createMockSupabaseClient(): any {
  return {
    from: (tableName: string) => new MockQueryBuilder(tableName),
    auth: {
      getSession: async () => ({
        data: { session: null },
        error: null,
      }),
      onAuthStateChange: (_cb: any) => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: new Error("Authentication requires Supabase credentials"),
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: new Error("Sign up requires Supabase credentials"),
      }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
      getClaims: async () => ({ data: null, error: null }),
    },
  };
}
