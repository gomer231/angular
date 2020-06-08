import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { FbResponse, Product } from './interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  create(product): Observable<Product> {
    return this.http.post(`${environment.fbDbUrl}/products.json`, product)
    .pipe(map( (res: FbResponse) => {
      return {
        ...product,
        id: res.name,
        data: new Date(product.date)
      };
    }));
  }

  getAll(): Observable<Product[]> {
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

  getById(id): Observable<Product>  {
    return this.http.get(`${environment.fbDbUrl}/products/${id}.json`)
      .pipe( map ( (res: Product) => {
        return {
          ...res,
          id,
          date: new Date(res.date)
        };
      }));
  }

  remove(id): Observable<null> {
    return this.http.delete<null>(`${environment.fbDbUrl}/products/${id}.json`);
  }

  update(product: Product) {
    return this.http.patch(`${environment.fbDbUrl}/products/${product.id}.json`, product);
  }
}
