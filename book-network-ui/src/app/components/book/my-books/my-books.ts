import { Component, signal } from '@angular/core';
import { BookResponse, PageResponseBookResponse } from '../../../services/models';
import { BookService } from '../../../services/services';
import { Router, RouterLink } from '@angular/router';
import { BookCard } from '../book-card/book-card';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-books',
  imports: [BookCard, RouterLink],
  templateUrl: './my-books.html',
  styleUrl: './my-books.scss',
})
export class MyBooks {
  bookResponse = signal<PageResponseBookResponse>({});
  page = signal(0);
  size = signal(4);
  pages = signal<any[]>([]);
  subscriptions: Array<Subscription> = [];

  constructor(
    private bookService: BookService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks() {
    const subscription = this.bookService
      .findAllBooksByOwner({
        page: this.page(),
        size: this.size(),
      })
      .subscribe({
        next: (books) => {
          this.bookResponse.set(books);
          this.pages.set(
            Array(this.bookResponse().totalPages)
              .fill(0)
              .map((x, i) => i),
          );
        },
      });
    this.subscriptions.push(subscription);
  }

  archiveBook(book: BookResponse) {
    const subscription = this.bookService
      .updateArchivedStatus({
        'book-id': book.id as number,
      })
      .subscribe({
        next: () => {
          const updatedBooks = this.bookResponse().content?.map((b) =>
            b.id === book.id ? { ...b, archived: !b.archived } : b,
          );
          this.bookResponse.set({ ...this.bookResponse(), content: updatedBooks });
        },
      });
    this.subscriptions.push(subscription);
  }

  shareBook(book: BookResponse) {
    const subscription = this.bookService
      .updateShareableStatus({
        'book-id': book.id as number,
      })
      .subscribe({
        next: () => {
          // mutating object properties directly doesn't trigger change detection for signals,
          // so we need to change the reference of the book object in the bookResponse signal to trigger the update in the UI
          // book.shareable = !book.shareable;
          const updatedBooks = this.bookResponse().content?.map((b) =>
            b.id === book.id ? { ...b, shareable: !b.shareable } : b,
          );
          this.bookResponse.set({ ...this.bookResponse(), content: updatedBooks });
        },
      });
    this.subscriptions.push(subscription);
  }

  editBook(book: BookResponse) {
    this.router.navigate(['books', 'manage', book.id]);
  }

  gotToPage(page: number) {
    this.page.set(page);
    this.findAllBooks();
  }

  goToFirstPage() {
    this.page.set(0);
    this.findAllBooks();
  }

  goToPreviousPage() {
    this.page.set(this.page() - 1);
    this.findAllBooks();
  }

  goToLastPage() {
    this.page.set((this.bookResponse().totalPages as number) - 1);
    this.findAllBooks();
  }

  goToNextPage() {
    this.page.set(this.page() + 1);
    this.findAllBooks();
  }

  get isLastPage() {
    return this.page() === (this.bookResponse().totalPages as number) - 1;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
