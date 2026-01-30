export interface MarketerStats {
  marketerName: string;
  todaySales: number;
  totalOrders: number;
  newCustomers: number;
  growthRate: number;
  salesTrend: number;
  ordersTrend: number;
  customersTrend: number;
  weeklySales: { day: string; sales: number }[];
}

export interface Order {
  id: string;
  storeName: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  items: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  balance: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}
