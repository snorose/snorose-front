import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  public getCurrentDate(): string {
    return new Date().toLocaleString();
  }

}