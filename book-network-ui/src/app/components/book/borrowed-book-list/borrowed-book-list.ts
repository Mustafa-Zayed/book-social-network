import { Component, signal } from '@angular/core';
import {
  BorrowedBookResponse,
  FeedbackRequest,
  PageResponseBorrowedBookResponse,
} from '../../../services/models';
import { BookService, FeedbackService } from '../../../services/services';
import { FormsModule, NgForm } from '@angular/forms';
import { Rating } from '../rating/rating';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-borrowed-book-list',
  imports: [FormsModule, Rating, RouterLink],
  templateUrl: './borrowed-book-list.html',
  styleUrl: './borrowed-book-list.scss',
})
export class BorrowedBookList {
  page = signal(0);
  size = 5;
  pages = signal<any[]>([]);
  borrowedBooks = signal<PageResponseBorrowedBookResponse>({});
  selectedBook = signal<BorrowedBookResponse | undefined>(undefined);
  feedbackRequest = signal<FeedbackRequest>({ bookId: 0, comment: '', note: 1 });
  subscriptions: Array<Subscription> = [];

  constructor(
    private bookService: BookService,
    private feedbackService: FeedbackService,
  ) {}
  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }

  private findAllBorrowedBooks() {
    const subscription = this.bookService
      .findAllBorrowedBooks({
        page: this.page(),
        size: this.size,
      })
      .subscribe({
        next: (resp) => {
          this.borrowedBooks.set(resp);
          this.pages.set(
            Array(this.borrowedBooks().totalPages)
              .fill(0)
              .map((x, i) => i),
          );
        },
      });
    this.subscriptions.push(subscription);
  }

  returnBorrowedBook(book: BorrowedBookResponse) {
    this.selectedBook.set(book);
    this.feedbackRequest.update((value) => ({ ...value, bookId: book.id as number }));
  }

  returnBook(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // Mark the book as returned
    const subscription = this.bookService
      .returnBorrowBook({
        'book-id': this.selectedBook()?.id as number,
      })
      .subscribe({
        next: () => {
          // Save the feedback
          this.giveFeedback();
          form.resetForm();
          this.selectedBook.set(undefined);
          this.findAllBorrowedBooks();
        },
      });
    this.subscriptions.push(subscription);
  }

  private giveFeedback() {
    const subscription = this.feedbackService
      .saveFeedback({
        body: this.feedbackRequest(),
      })
      .subscribe({
        next: () => {},
      });
    this.subscriptions.push(subscription);
  }

  gotToPage(page: number) {
    this.page.set(page);
    this.findAllBorrowedBooks();
  }

  goToFirstPage() {
    this.page.set(0);
    this.findAllBorrowedBooks();
  }

  goToPreviousPage() {
    this.page.set(this.page() - 1);
    this.findAllBorrowedBooks();
  }

  goToLastPage() {
    this.page.set((this.borrowedBooks().totalPages as number) - 1);
    this.findAllBorrowedBooks();
  }

  goToNextPage() {
    this.page.set(this.page() + 1);
    this.findAllBorrowedBooks();
  }

  get isLastPage() {
    return this.page() === (this.borrowedBooks().totalPages as number) - 1;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
