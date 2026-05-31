import { Routes } from '@angular/router';
import { Main } from './main/main';
import { BookList } from './book-list/book-list';

export const routes: Routes = [
  {
    path: '',
    component: Main,
    children: [
      {
        path: '',
        component: BookList,
      },
    ],
  },
];
