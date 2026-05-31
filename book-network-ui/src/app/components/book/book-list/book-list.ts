import { Component, OnInit, signal } from '@angular/core';
import { BookResponse, PageResponseBookResponse } from '../../../services/models';
import { BookService } from '../../../services/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookCard } from '../book-card/book-card';

@Component({
  selector: 'app-book-list',
  imports: [BookCard],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
})
export class BookList implements OnInit {
  bookResponse = signal<PageResponseBookResponse>({});
  page = signal(0);
  size = signal(4);
  pages = signal<any[]>([]);
  message = signal('');
  level = signal<'success' | 'error'>('success');
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
      .findAllBooks({
        page: this.page(),
        size: this.size(),
      })
      .subscribe({
        next: (books) => {
          this.bookResponse.set(books);
          this.pages.set(
            Array(books.totalPages)
              .fill(0)
              .map((x, i) => i),
          );
        },
      });
    this.subscriptions.push(subscription);
  }

  goToFirstPage() {
    this.page.set(0);
    this.findAllBooks();
  }

  goToPreviousPage() {
    this.page.update((p) => p - 1);
    this.findAllBooks();
  }

  gotToPage(page: number) {
    this.page.set(page);
    this.findAllBooks();
  }

  goToLastPage() {
    this.page.set((this.bookResponse().totalPages as number) - 1);
    this.findAllBooks();
  }

  goToNextPage() {
    this.page.update((p) => p + 1);
    this.findAllBooks();
  }

  get isLastPage() {
    return this.page() === (this.bookResponse().totalPages as number) - 1;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
