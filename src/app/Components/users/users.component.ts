import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  averageSpending: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date;
  joinDate: Date;
  avatar: string;
  orders: number;
  totalSpent: number;
  location: string;
  verified: boolean;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  // Make Math available in the template
  protected readonly Math = Math;

  users: User[] = [];
  searchTerm: string = '';
  selectedRole: string = 'all';
  selectedStatus: string = 'all';
  selectedTimeframe: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  roles: string[] = ['Customer', 'Admin', 'Manager', 'Support'];
  userStats: UserStats = {
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    averageSpending: 0
  };

  ngOnInit() {
    this.loadUsers();
    this.calculateUserStats();
  }

  loadUsers() {
    // Simulated user data - replace with actual API call
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Customer',
        status: 'active',
        lastLogin: new Date('2024-01-15'),
        joinDate: new Date('2023-06-10'),
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
        orders: 15,
        totalSpent: 1250.50,
        location: 'New York, USA',
        verified: true
      },
      {
        id: 2,
        name: 'Sarah Smith',
        email: 'sarah.smith@example.com',
        role: 'Admin',
        status: 'active',
        lastLogin: new Date('2024-01-16'),
        joinDate: new Date('2023-04-15'),
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=4C8B2B&color=fff',
        orders: 8,
        totalSpent: 875.20,
        location: 'London, UK',
        verified: true
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        role: 'Manager',
        status: 'inactive',
        lastLogin: new Date('2024-01-10'),
        joinDate: new Date('2023-08-22'),
        avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=A85432&color=fff',
        orders: 12,
        totalSpent: 2340.75,
        location: 'Toronto, CA',
        verified: true
      },
      {
        id: 4,
        name: 'Emma Wilson',
        email: 'emma.w@example.com',
        role: 'Support',
        status: 'pending',
        lastLogin: new Date('2024-01-17'),
        joinDate: new Date('2024-01-17'),
        avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=6C757D&color=fff',
        orders: 0,
        totalSpent: 0,
        location: 'Sydney, AU',
        verified: false
      }
    ];
  }

  calculateUserStats() {
    this.userStats = {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.status === 'active').length,
      newUsersToday: this.users.filter(u =>
        u.joinDate.toDateString() === new Date().toDateString()
      ).length,
      averageSpending: this.users.reduce((acc, user) => acc + user.totalSpent, 0) / this.users.length
    };
  }

  get filteredUsers() {
    return this.users
      .filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            user.location.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesRole = this.selectedRole === 'all' || user.role === this.selectedRole;
        const matchesStatus = this.selectedStatus === 'all' || user.status === this.selectedStatus;
        const matchesTimeframe = this.filterByTimeframe(user);

        return matchesSearch && matchesRole && matchesStatus && matchesTimeframe;
      })
      .sort((a, b) => this.sortUsers(a, b));
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  filterByTimeframe(user: User): boolean {
    if (this.selectedTimeframe === 'all') return true;
    const today = new Date();
    const joinDate = new Date(user.joinDate);

    switch(this.selectedTimeframe) {
      case 'today':
        return joinDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        return joinDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
        return joinDate >= monthAgo;
      default:
        return true;
    }
  }

  sortUsers(a: User, b: User): number {
    const direction = this.sortDirection === 'asc' ? 1 : -1;

    switch(this.sortColumn) {
      case 'name':
        return direction * a.name.localeCompare(b.name);
      case 'orders':
        return direction * (a.orders - b.orders);
      case 'spent':
        return direction * (a.totalSpent - b.totalSpent);
      case 'joinDate':
        return direction * (a.joinDate.getTime() - b.joinDate.getTime());
      default:
        return 0;
    }
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
  }

  onRoleFilter(event: Event) {
    this.selectedRole = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
  }

  onStatusFilter(event: Event) {
    this.selectedStatus = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
  }

  onTimeframeFilter(event: Event) {
    this.selectedTimeframe = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  exportUsers() {
    // Implement export functionality
    console.log('Exporting users...');
  }

  bulkAction(action: string) {
    // Implement bulk actions
    console.log(`Performing bulk action: ${action}`);
  }


}

