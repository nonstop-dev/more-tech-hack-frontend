import { Component, EventEmitter, Output } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
})
export class SearchCardComponent {
  @Output() search = new EventEmitter();
  @Output() changeTransportEvent = new EventEmitter<string>();

  private readonly searchSubject = new Subject<string | undefined>();  
  public currentAccordeonTab = '';
  private searchSubscription?: Subscription;

  public ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((searchQuery) => (this.search.emit(searchQuery)));
  }

  public ngOnDestroy(): void {
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
