import { Routes } from '@angular/router';
import { Main } from './main/main';
import { BookList } from './book-list/book-list';
import { MyBooks } from './my-books/my-books';
import { ManageBook } from './manage-book/manage-book';
import { BorrowedBookList } from './borrowed-book-list/borrowed-book-list';
import { ReturnedBooks } from './returned-books/returned-books';
import { authGuard } from '../../services/guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Main,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: BookList,
        canActivate: [authGuard],
      },
      {
        path: 'my-books',
        component: MyBooks,
        canActivate: [authGuard],
      },
      {
        path: 'manage',
        component: ManageBook,
        canActivate: [authGuard],
      },
      {
        path: 'manage/:bookId',
        component: ManageBook,
        canActivate: [authGuard],
      },
      {
        path: 'my-returned-books',
        component: ReturnedBooks,
        canActivate: [authGuard],
      },
      {
        path: 'my-borrowed-books',
        component: BorrowedBookList,
        canActivate: [authGuard],
      },
    ],
  },
];
