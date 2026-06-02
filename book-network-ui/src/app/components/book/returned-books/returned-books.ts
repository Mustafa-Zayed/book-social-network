import { Component, signal } from '@angular/core';
import { BorrowedBookResponse, PageResponseBorrowedBookResponse } from '../../../services/models';
import { BookService } from '../../../services/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-returned-books',
  imports: [],
  templateUrl: './returned-books.html',
  styleUrl: './returned-books.scss',
})
export class ReturnedBooks {
  page = signal(0);
  size = 5;
  pages = signal<any[]>([]);
  returnedBooks = signal<PageResponseBorrowedBookResponse>({});
  message = signal('');
  level = signal<'success' | 'error'>('success');
  subscriptions: Array<Subscription> = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.findAllReturnedBooks();
  }

  private findAllReturnedBooks() {
    const subscription = this.bookService
      .findAllReturnedBooks({
        page: this.page(),
        size: this.size,
      })
      .subscribe({
        next: (resp) => {
          this.returnedBooks.set(resp);
          this.pages.set(
            Array(this.returnedBooks().totalPages)
              .fill(0)
              .map((x, i) => i),
          );
        },
      });
    this.subscriptions.push(subscription);
  }

  approveBookReturn(book: BorrowedBookResponse) {
    if (!book.returned) {
      return;
    }
    const subscription = this.bookService
      .approveReturnBorrowBook({
        'book-id': book.id as number,
      })
      .subscribe({
        next: () => {
          this.level.set('success');
          this.message.set('Book return approved');
          this.findAllReturnedBooks();
        },
        error: (err) => {
          this.level.set('error');
          this.message.set(err.error.error);
        },
      });
    this.subscriptions.push(subscription);
  }

  gotToPage(page: number) {
    this.page.set(page);
    this.findAllReturnedBooks();
  }

  goToFirstPage() {
    this.page.set(0);
    this.findAllReturnedBooks();
  }

  goToPreviousPage() {
    this.page.set(this.page() - 1);
    this.findAllReturnedBooks();
  }

  goToLastPage() {
    this.page.set((this.returnedBooks().totalPages as number) - 1);
    this.findAllReturnedBooks();
  }

  goToNextPage() {
    this.page.set(this.page() + 1);
    this.findAllReturnedBooks();
  }

  get isLastPage() {
    return this.page() === (this.returnedBooks().totalPages as number) - 1;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
