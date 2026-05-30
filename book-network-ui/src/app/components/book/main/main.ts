import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Menu],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
