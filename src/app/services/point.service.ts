import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPoint, IPointBookBody, IPointQuery, ResponseModel } from './types';

@Injectable({
  providedIn: 'root',
})
export class PointService {
  constructor(private readonly http: HttpClient) {}

  private readonly pointsUrl = environment.apiUrl + '/points';
  public currentPoint = new BehaviorSubject<IPoint | null>(null);
  public currentTemplate = new BehaviorSubject<string>('search');

  public get(paramsObject?: IPointQuery): Observable<ResponseModel<IPoint[]>> {
    const params = new HttpParams({ fromObject: paramsObject });
    return this.http.get<ResponseModel<IPoint[]>>(this.pointsUrl, { params: params });
  }

  public getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.pointsUrl}/${id}`);
  }

  public bookPoint(id: string, body: IPointBookBody): Observable<any> {
    return this.http.post(`${this.pointsUrl}/${id}/book`, body);
  }
}
