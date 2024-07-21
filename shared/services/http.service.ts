import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../../src/environments/environment";
import { Observable, catchError } from "rxjs";
import { MembershipService } from "./membership.service";

export interface IParams {
  [param: string]: string | string[] | number;
}

export const BASE_URL = environment.base_url;

@Injectable({ providedIn: 'root' })
export class HttpService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private membershipService: MembershipService) { }

  public PostWithoutToken(endPoint: string, data: any, header?: any): Observable<any> {
    return this.http.post(`${BASE_URL}${endPoint}`, data)
      .pipe(catchError(this.handleError("Post", data)));
  }

  public Delete(endPoint: string, data?: any, header?: any): Observable<any> {
    return this.http.delete(`${BASE_URL}${endPoint}`, {
      headers: new HttpHeaders({
        Authorization:
          `Bearer ${this.membershipService.data.tokenResponse.accessToken}`
      }),
      body: data ?? null
    }).pipe(catchError(this.handleError("Delete")));
  }

  public Post(endPoint: string, data: any, header?: any): Observable<any> {
    return this.http.post(`${BASE_URL}${endPoint}`, data, {
      headers: new HttpHeaders({
        Authorization:
          `Bearer ${this.membershipService.data.tokenResponse.accessToken}`
      })
    }).pipe(catchError(this.handleError("Post", data)));
  }

  public Put(endPoint: string, data: any, header?: any): Observable<any> {
    return this.http.put(`${BASE_URL}${endPoint}`, data, {
      headers: new HttpHeaders({
        Authorization:
          `Bearer ${this.membershipService.data.tokenResponse.accessToken}`
      })
    }).pipe(catchError(this.handleError("Put", data)));
  }

  public Patch(endPoint: string, data: any, header?: any): Observable<any> {
    return this.http.patch(`${BASE_URL}${endPoint}`, data, {
      headers: new HttpHeaders({
        Authorization:
          `Bearer ${this.membershipService.data.tokenResponse.accessToken}`
      })
    }).pipe(catchError(this.handleError("Patch", data)));
  }

  public Get(endPoint: string, params?: IParams, header?: any): Observable<any> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          (params[key] as string[]).forEach(value => {
            httpParams = httpParams.append(key, value);
          });
        }
        else {
          httpParams = httpParams.set(key, (params[key] as string));
        }
      });
    }

    return this.http.get(`${BASE_URL}${endPoint}`, {
      params: httpParams, headers: new HttpHeaders({
        Authorization:
          `Bearer ${this.membershipService.data.tokenResponse.accessToken}`
      })
    }).pipe(catchError(this.handleError("Get")));
  }

  public GetJson(url: string): Observable<any> {
    return this.http.get(url)
      .pipe(catchError(this.handleError("GetJson")));
  }

  public GetBlob(endPoint: string) {
    return this.http.get(`${BASE_URL}${endPoint}`, { responseType: 'blob', observe: 'response' });
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): any => {
      this.snackBar(error.message, "ERROR");
    };
  }

  private snackBar(text: string, undo: string = "", duration: number = 2000) {
    this._snackBar.open(text, undo, {
      duration: duration,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  }

}