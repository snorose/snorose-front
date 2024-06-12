import { Observable } from "rxjs";
import { POINT_CATEGORY, POINT_SOURCE } from "../data/point.data";
import { IBaseResponse } from "./baseResponse.dto";
import { HttpService } from "../services/http.service";
import { inject } from "@angular/core";

export interface IAddPointRequest {
  userId: number;
  difference?: number;
  category: POINT_CATEGORY;
  sourceId?: number;
  source: POINT_SOURCE;
}

export interface IAddPointData {
  category: string;
  difference: number;
  balance: number;
}

export interface IAddPointResponse extends IBaseResponse<IAddPointData> { }

export interface IGetPointData {
  id: number;
  difference: number;
  category: string;
  sourceId: number;
  source: POINT_SOURCE;
  createdAt: string;
}

export interface IGetPointResponse extends IBaseResponse<{
  hasNext: boolean;
  pointLogResponse: IGetPointData[];
}> { }

export interface IPointHttp {
  fluctuate(request: IAddPointRequest): Observable<IAddPointResponse>;
  get(page: number): Observable<IGetPointResponse>;
}

export class PointHttp implements IPointHttp {

  private readonly httpService = inject(HttpService);

  fluctuate(request: IAddPointRequest): Observable<IAddPointResponse> {
    return this.httpService.Post(`/v1/points`, request);
  }

  get(page: number): Observable<IGetPointResponse> {
    return this.httpService.Get(`/v1/points/${page}`);
  }

}