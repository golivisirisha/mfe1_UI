import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProductStats {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  outOfStock: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  sales: number;
  image: string;
  description: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  featured: boolean;
  discount?: number;
  brand: string;
  sku: string;
  lastUpdated: Date;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
  brands: string[] = ['All', 'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony'];
  selectedCategory: string = 'All';
  selectedBrand: string = 'All';
  searchTerm: string = '';
  sortBy: string = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  viewMode: 'grid' | 'list' = 'grid';
  priceRange: { min: number; max: number } = { min: 0, max: 1000 };
  showFilters: boolean = false;
  selectedProducts: Set<number> = new Set();
  stats: ProductStats = {
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0
  };

  ngOnInit() {
    this.loadProducts();
    this.calculateStats();
  }

  loadProducts() {
    // Simulated product data - replace with actual API call
    this.products = [
      {
        id: 1,
        name: 'iPhone 13 Pro',
        category: 'Electronics',
        price: 999.99,
        stock: 45,
        rating: 4.8,
        sales: 1234,
        image:'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Latest iPhone with pro camera system',
        status: 'in-stock',
        featured: true,
        discount: 10,
        brand: 'Apple',
        sku: 'IP13-PRO-128',
        lastUpdated: new Date()
      },
      {
        id: 2,
        name: 'Galaxy Watch 5',
        category: 'Electronics',
        price: 299.99,
        stock: 30,
        rating: 4.6,
        sales: 856,
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Advanced health tracking smartwatch',
        status: 'in-stock',
        featured: true,
        brand: 'Samsung',
        sku: 'GW5-44MM-BLK',
        lastUpdated: new Date()
      },
      {
        id: 3,
        name: 'Air Zoom Pegasus',
        category: 'Sports',
        price: 129.99,
        stock: 5,
        rating: 4.7,
        sales: 2341,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Professional running shoes',
        status: 'low-stock',
        featured: false,
        discount: 20,
        brand: 'Nike',
        sku: 'AZP-38-BLU',
        lastUpdated: new Date()
      },
      {
        id: 4,
        name: 'WH-1000XM4',
        category: 'Electronics',
        price: 349.99,
        stock: 0,
        rating: 4.9,
        sales: 1567,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Premium noise-cancelling headphones',
        status: 'out-of-stock',
        featured: false,
        brand: 'Sony',
        sku: 'WH1000XM4-BLK',
        lastUpdated: new Date()
      }
    ];
    this.applyFilters();
  }

  calculateStats() {
    this.stats = {
      totalProducts: this.products.length,
      totalValue: this.products.reduce((sum, product) => sum + product.price * product.stock, 0),
      lowStock: this.products.filter(p => p.status === 'low-stock').length,
      outOfStock: this.products.filter(p => p.status === 'out-of-stock').length
    };
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleProductSelection(productId: number) {
    if (this.selectedProducts.has(productId)) {
      this.selectedProducts.delete(productId);
    } else {
      this.selectedProducts.add(productId);
    }
  }

  selectAllProducts() {
    if (this.selectedProducts.size === this.filteredProducts.length) {
      this.selectedProducts.clear();
    } else {
      this.filteredProducts.forEach(p => this.selectedProducts.add(p.id));
    }
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.selectedCategory === 'All' || product.category === this.selectedCategory;
      const matchesBrand = this.selectedBrand === 'All' || product.brand === this.selectedBrand;
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesPrice = product.price >= this.priceRange.min && product.price <= this.priceRange.max;

      return matchesCategory && matchesBrand && matchesSearch && matchesPrice;
    });

    this.sortProducts();
  }

  sortProducts() {
    this.filteredProducts.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          break;
        case 'sales':
          comparison = b.sales - a.sales;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'updated':
          comparison = b.lastUpdated.getTime() - a.lastUpdated.getTime();
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onBrandChange(brand: string) {
    this.selectedBrand = brand;
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

  getDiscountedPrice(price: number, discount?: number): number {
    if (!discount) return price;
    return price * (1 - discount / 100);
  }

  getRatingStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill('fas fa-star'),
      ...(hasHalfStar ? ['fas fa-star-half-alt'] : []),
      ...Array(emptyStars).fill('far fa-star')
    ];
  }

  formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }

  deleteSelectedProducts() {
    // Implement delete functionality
    console.log('Deleting products:', this.selectedProducts);
  }

  exportSelectedProducts() {
    // Implement export functionality
    console.log('Exporting products:', this.selectedProducts);
  }

}
