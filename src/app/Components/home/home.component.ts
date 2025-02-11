import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  trend: number;
  color: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  date: Date;
  amount: number;
  status: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'

})
export class HomeComponent  {
  Math = Math;
  stats: StatCard[] = [
    {
      title: 'Total Sales',
      value: 54232,
      icon: 'fa-solid fa-dollar-sign',
      trend: 12.5,
      color: 'primary'
    },
    {
      title: 'Total Orders',
      value: 1432,
      icon: 'fa-solid fa-shopping-cart',
      trend: 8.2,
      color: 'success'
    },
    {
      title: 'New Users',
      value: 893,
      icon: 'fa-solid fa-users',
      trend: -2.4,
      color: 'info'
    },
    {
      title: 'Product Views',
      value: 12538,
      icon: 'fa-solid fa-eye',
      trend: 15.3,
      color: 'warning'
    }
  ];

  recentOrders: RecentOrder[] = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      date: new Date(),
      amount: 234.50,
      status: 'Completed'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      date: new Date(),
      amount: 512.75,
      status: 'Processing'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      date: new Date(),
      amount: 189.99,
      status: 'Pending'
    }
  ];

  ngOnInit(): void {
    // Initialize any data or make API calls here
  }

}
