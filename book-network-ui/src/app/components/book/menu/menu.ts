import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  get loggedInUser() {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(atob(token.split('.')[1])).fullName : null;
  }
}
