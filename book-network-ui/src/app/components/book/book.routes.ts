import { Routes } from '@angular/router';
import { Main } from './main/main';
import { BookList } from './book-list/book-list';
import { MyBooks } from './my-books/my-books';
import { ManageBook } from './manage-book/manage-book';
import { BorrowedBookList } from './borrowed-book-list/borrowed-book-list';
import { ReturnedBooks } from './returned-books/returned-books';

export const routes: Routes = [
  {
    path: '',
    component: Main,
    children: [
      {
        path: '',
        component: BookList,
      },
      {
        path: 'my-books',
        component: MyBooks,
      },
      {
        path: 'manage',
        component: ManageBook,
      },
      {
        path: 'manage/:bookId',
        component: ManageBook,
      },
      {
        path: 'my-returned-books',
        component: ReturnedBooks,
      },
      {
        path: 'my-borrowed-books',
        component: BorrowedBookList,
      },
    ],
  },
];
