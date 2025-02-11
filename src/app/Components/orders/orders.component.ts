import { Component } from '@angular/core';
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
}

interface Order {
  id: string;
  customerName: string;
  orderDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  paymentMethod: string;
  shippingMethod: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,BrowserModule,FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statuses: string[] = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  selectedStatus: string = 'All';
  searchTerm: string = '';
  sortBy: string = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';
  viewMode: 'grid' | 'list' = 'list';
  dateRange: { start: Date | null, end: Date | null } = { start: null, end: null };
  showFilters: boolean = false;
  selectedOrders: Set<string> = new Set();
  stats: OrderStats = {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0
  };

  ngOnInit() {
    this.loadOrders();
    this.calculateStats();
  }

  loadOrders() {
    // Simulated order data - replace with actual API call
    this.orders = [
      {
        id: 'ORD-001',
        customerName: 'John Doe',
        orderDate: new Date('2023-05-15'),
        status: 'delivered',
        total: 129.99,
        items: 3,
        paymentMethod: 'Credit Card',
        shippingMethod: 'Express'
      },
      {
        id: 'ORD-002',
        customerName: 'Jane Smith',
        orderDate: new Date('2023-05-16'),
        status: 'processing',
        total: 79.50,
        items: 2,
        paymentMethod: 'PayPal',
        shippingMethod: 'Standard'
      },
      {
        id: 'ORD-003',
        customerName: 'Bob Johnson',
        orderDate: new Date('2023-05-17'),
        status: 'pending',
        total: 199.99,
        items: 1,
        paymentMethod: 'Credit Card',
        shippingMethod: 'Next Day'
      },
      {
        id: 'ORD-004',
        customerName: 'Alice Brown',
        orderDate: new Date('2023-05-18'),
        status: 'shipped',
        total: 54.75,
        items: 4,
        paymentMethod: 'Debit Card',
        shippingMethod: 'Standard'
      },
      {
        id: 'ORD-005',
        customerName: 'Charlie Wilson',
        orderDate: new Date('2023-05-19'),
        status: 'cancelled',
        total: 89.99,
        items: 2,
        paymentMethod: 'Credit Card',
        shippingMethod: 'Express'
      }
    ];
    this.applyFilters();
  }

  calculateStats() {
    this.stats = {
      totalOrders: this.orders.length,
      totalRevenue: this.orders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: this.orders.reduce((sum, order) => sum + order.total, 0) / this.orders.length,
      pendingOrders: this.orders.filter(order => order.status === 'pending').length
    };
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleOrderSelection(orderId: string) {
    if (this.selectedOrders.has(orderId)) {
      this.selectedOrders.delete(orderId);
    } else {
      this.selectedOrders.add(orderId);
    }
  }

  applyFilters() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesStatus = this.selectedStatus === 'All' || order.status === this.selectedStatus.toLowerCase();
      const matchesSearch = order.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDateRange = (!this.dateRange.start || order.orderDate >= this.dateRange.start) &&
                               (!this.dateRange.end || order.orderDate <= this.dateRange.end);

      return matchesStatus && matchesSearch && matchesDateRange;
    });

    this.sortOrders();
  }

  sortOrders() {
    this.filteredOrders.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'date':
          comparison = b.orderDate.getTime() - a.orderDate.getTime();
          break;
        case 'total':
          comparison = b.total - a.total;
          break;
        case 'items':
          comparison = b.items - a.items;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onSortChange(event: Event) {
    this.sortBy = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onSortOrderChange() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  onDateRangeChange() {
    this.applyFilters();
  }

  formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(2);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }

  exportSelectedOrders() {
    // Implement export functionality
    console.log('Exporting orders:', this.selectedOrders);
  }

  printSelectedOrders() {
    // Implement print functionality
    console.log('Printing orders:', this.selectedOrders);
  }

}
