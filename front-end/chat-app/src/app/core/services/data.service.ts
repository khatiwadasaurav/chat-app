import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable()
export class DataService {
    public details: any
    public detailsSubject = new BehaviorSubject<any>(this.details);
    detailsChanged$ = this.detailsSubject.asObservable();

    detailsUpdate(newValues): Observable<any> {
        this.details = newValues
        this.detailsSubject.next(this.details);
        return of(this.details);
    }
}