import { Observable } from "rxjs";
import { IBaseResponse } from "./baseResponse.dto";
import { HttpService } from "../services/http.service";
import { inject } from "@angular/core";

export interface ISignUpRequest {
  loginId: string;
  password: string;
  checkedPassword: string;
  userName: string;
  email: string;
  nickname: string;
  studentNumber: number;
  major: string;
  birthday: string;
}

export interface ISignInRequest {
  loginId: string;
  password: string;
}

export interface ISignUpData {
  id: number;
  loginId: string;
  password: string;
  userName: string;
  email: string;
  nickname: string;
  studentNumber: number;
  major: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISingInData {
  tokenResponse: {
    grantType: string;
    accessToken: string;
    refreshToken: string;
  },
  nickname: string;
  balance: number;
  userRoleId: number;
  birthday: string;
}

export interface ISignUpResponse extends IBaseResponse<ISignUpData> { }
export interface ISignInResponse extends IBaseResponse<ISingInData> { }


export interface IMembershipHttp {
  signUp(request: ISignUpRequest): Observable<ISignUpResponse>;
  signIn(request: ISignInRequest): Observable<ISignInResponse>;
}

export class MembershipHttp implements IMembershipHttp {

  private readonly httpService = inject(HttpService);

  public signUp(request: ISignUpRequest): Observable<ISignUpResponse> {
    return this.httpService.PostWithoutToken(`/v1/users/register`, request);
  }

  public signIn(request: ISignInRequest): Observable<ISignInResponse> {
    return this.httpService.PostWithoutToken(`/v1/users/login`, request);
  }

}

