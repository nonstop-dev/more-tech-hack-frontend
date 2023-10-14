import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
})
export class SearchCardComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter();
  @Output() changeTransportEvent = new EventEmitter<string>();

  private readonly searchSubject = new Subject<string | undefined>();
  public currentAccordeonTab = '';
  private searchSubscription?: Subscription;

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchQuery) => this.search.emit(searchQuery));
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  public onSearchQueryInput(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchQuery?.trim());
  }

  public handleAccordion(id: string) {
    if (id === this.currentAccordeonTab) {
      this.currentAccordeonTab = '';
      return;
    }
    this.currentAccordeonTab = id;
  }

  changeTransport(type: string): void {
    this.changeTransportEvent.emit(type);
  }
}
