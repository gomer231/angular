import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../shared/interfaces';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(products: Product[], productName = ''): unknown {
   if (!productName.trim()) {
     return products;
   }

   return products.filter( product => {
     return product.title.toLocaleLowerCase().includes(productName.toLocaleLowerCase())
   })
  }
}
