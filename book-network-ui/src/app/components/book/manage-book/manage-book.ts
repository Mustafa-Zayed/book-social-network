import { Component, signal } from '@angular/core';
import { BookRequest } from '../../../services/models';
import { BookService } from '../../../services/services';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-book',
  imports: [FormsModule, RouterLink],
  templateUrl: './manage-book.html',
  styleUrl: './manage-book.scss',
})
export class ManageBook {
  errorMsg = signal<string[]>([]);
  bookRequest = signal<BookRequest>({
    authorName: '',
    isbn: '',
    synopsis: '',
    title: '',
    shareable: false,
  });
  selectedBookCover = signal<any>(undefined);
  selectedPicture = signal<string | undefined>('');
  subscriptions: Array<Subscription> = [];

  constructor(
    private bookService: BookService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    const bookId = this.activatedRoute.snapshot.params['bookId'];
    if (bookId) {
      const subscription = this.bookService
        .findBookById({
          'book-id': bookId,
        })
        .subscribe({
          next: (book) => {
            this.bookRequest.set({
              id: book.id,
              title: book.title as string,
              authorName: book.authorName as string,
              isbn: book.isbn as string,
              synopsis: book.synopsis as string,
              shareable: book.shareable,
            });
            if (book.cover) {
              this.selectedPicture.set(`data:image/jpg;base64,${book.cover}`);
            }
          },
        });
      this.subscriptions.push(subscription);
    }
  }

  saveBook() {
    const subscription = this.bookService
      .saveBook({
        body: this.bookRequest(),
      })
      .subscribe({
        next: (bookId) => {
          const subscription = this.bookService
            .uploadBookCoverPicture({
              'book-id': bookId,
              body: {
                file: this.selectedBookCover(),
              },
            })
            .subscribe({
              next: () => {
                this.toastrService.info('Book information has been successfully saved', 'Done');
                this.router.navigate(['/books/my-books']);
              },
            });
          this.subscriptions.push(subscription);
        },
        error: (err) => {
          this.toastrService.warning('Something went wrong', 'Oups!');
          this.errorMsg.set(err.error.validationErrors || err.error.error);
        },
      });
    this.subscriptions.push(subscription);
  }

  onFileSelected(event: any) {
    this.selectedBookCover.set(event.target.files[0]);
    console.log(this.selectedBookCover());

    if (this.selectedBookCover()) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture.set(reader.result as string);
      };
      reader.readAsDataURL(this.selectedBookCover());
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
