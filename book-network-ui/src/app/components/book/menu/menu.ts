import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private keycloakService = inject(KeycloakService);

  async logout() {
    await this.keycloakService.logout();
  }

  get loggedInUser() {
    return (
      `${this.keycloakService.profile?.firstName} ${this.keycloakService.profile?.lastName}` || null
    );
  }
}
