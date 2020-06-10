import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FbResponse, Product } from './interfaces';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  create(order): Observable<Product> {
    return this.http.post(`${environment.fbDbUrl}/orders.json`, order)
      .pipe(map( (res: FbResponse) => {
        return {
          ...order,
          id: res.name,
          data: new Date(order.date)
        };
      }));
  }

/*  getAll(): Observable<Product[]> {
    return this.http.get(`${environment.fbDbUrl}/products.json`)
      .pipe( map ( res => {
        return Object.keys(res)
          .map( key => ({
            ...res[key],
            id: key,
            date: new Date(res[key].date)
          }));
      }));
  }

  remove(id): Observable<null> {
    return this.http.delete<null>(`${environment.fbDbUrl}/products/${id}.json`);
  }*/
}
