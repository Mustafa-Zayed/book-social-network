import { Component, computed, input, Input, output } from '@angular/core';
import { BookResponse } from '../../../services/models';
import { Rating } from '../rating/rating';

@Component({
  selector: 'app-book-card',
  imports: [Rating],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard {
  book = input<BookResponse>({});
  manage = input(false);
  bookCover = computed(() => {
    const cover = this.book().cover;

    return cover ? `data:image/jpg;base64,${cover}` : 'https://picsum.photos/800/600';
  });

  share = output<BookResponse>();
  archive = output<BookResponse>();
  addToWaitingList = output<BookResponse>();
  borrow = output<BookResponse>();
  edit = output<BookResponse>();
  details = output<BookResponse>();

  onShare() {
    this.share.emit(this.book());
  }

  onArchive() {
    this.archive.emit(this.book());
  }

  onAddToWaitingList() {
    this.addToWaitingList.emit(this.book());
  }

  onBorrow() {
    this.borrow.emit(this.book());
  }

  onEdit() {
    this.edit.emit(this.book());
  }

  onShowDetails() {
    this.details.emit(this.book());
  }
}
