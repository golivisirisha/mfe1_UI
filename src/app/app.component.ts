import { Component } from '@angular/core';
import { HomeComponent } from "./Components/home/home.component";
import { UsersComponent } from "./Components/users/users.component";
import { ProductsComponent } from "./Components/products/products.component";
import { OrdersComponent } from "./Components/orders/orders.component";


@Component({
  selector: 'app-root',
  imports: [HomeComponent, UsersComponent, ProductsComponent, OrdersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mainapp';
}
