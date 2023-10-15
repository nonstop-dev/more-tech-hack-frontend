import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
})
export class SearchCardComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter();
  @Output() check = new EventEmitter();
  @Output() changeTransportEvent = new EventEmitter<string>();

  private readonly searchSubject = new Subject<string | undefined>();
  private readonly checkSubject = new Subject<boolean>();
  private $unsubscribe: Subject<void> = new Subject<void>();
  public currentAccordeonTab = '';
  public isChecked = false;
  private searchSubscription?: Subscription;

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchQuery) => this.search.emit(searchQuery));
    this.checkSubject
      .pipe(
        takeUntil(this.$unsubscribe),
        tap((value: boolean) => {
          this.check.emit(value);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.$unsubscribe.unsubscribe();
  }

  public onSearchQueryInput(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchQuery?.trim());
  }

  public onRecommendedCheckbox(value: boolean): void {
    this.checkSubject.next(value);
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
