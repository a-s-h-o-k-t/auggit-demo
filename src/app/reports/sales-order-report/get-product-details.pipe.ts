import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getProductDetails',
})
export class GetProductDetailsPipe implements PipeTransform {
  transform(value: any[]): string {
    return value.map((item) => item.pname).join(', ');
  }
}
