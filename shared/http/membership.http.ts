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
  userId: number;
  nickname: string;
  balance: number;
  userRoleId: number;
  birthday: string;
}

export interface IFindIdRequest {
  userName: string;
  email: string;
  studentNumber: number;
}

export interface IChangeProfileRequest {
  userName?: string;
  email?: string;
  birthday?: string;
  nickname?: string;
  userProfile?: string;
  major?: string;
}

export interface IChangeProfileData {
  loginId: string;
  userName: string;
  email: string;
  nickname: string;
  userRoleId: number;
  studentNumber: number;
  major: string;
  birthday: string;
  userProfile: null;
}
export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface IUserData {
  loginId: string;
  userName: string;
  email: string;
  nickname: string;
  userRoleId: number;
  studentNumber: number;
  major: string;
  birthday: string;
  userProfile: string | null;
  balance: number;
}

export interface ISignUpResponse extends IBaseResponse<ISignUpData> { }
export interface ISignInResponse extends IBaseResponse<ISingInData> { }
export interface IFindIdResponse extends IBaseResponse<{ loginId: string }> {}
export interface IGetUserResponse extends IBaseResponse<IUserData> {}
export interface IChangeProfileResponse extends IBaseResponse<IChangeProfileData> {}

export interface IMembershipHttp {
  get(): Observable<IGetUserResponse>;
  signUp(request: ISignUpRequest): Observable<ISignUpResponse>;
  signIn(request: ISignInRequest): Observable<ISignInResponse>;
  findId(request: IFindIdRequest): Observable<IFindIdResponse>;
  delete(currentPassword: string): Observable<IBaseResponse<string>>;
  changeProfile(request: IChangeProfileRequest): Observable<IChangeProfileResponse>;
  changePassword(request: IChangePasswordRequest): Observable<IBaseResponse<string>>;
}

export class MembershipHttp implements IMembershipHttp {

  private readonly httpService = inject(HttpService);

  public get(): Observable<IGetUserResponse> {
    return this.httpService.Get(`/v1/users/mypage`);
  }

  public signUp(request: ISignUpRequest): Observable<ISignUpResponse> {
    return this.httpService.PostWithoutToken(`/v1/users/register`, request);
  }

  public signIn(request: ISignInRequest): Observable<ISignInResponse> {
    return this.httpService.PostWithoutToken(`/v1/users/login`, request);
  }

  public findId(request: IFindIdRequest): Observable<IFindIdResponse> {
    return this.httpService.PostWithoutToken(`/v1/users/findid`, request);
  }

  public delete(currentPassword: string): Observable<IBaseResponse<string>> {
    return this.httpService.Delete(`/v1/users/withdraw`, { currentPassword });
  }

  public changeProfile(request: IChangeProfileRequest): Observable<IChangeProfileResponse> {
    return this.httpService.Patch(`/v1/users/mypage`, request);
  }

  public changePassword(request: IChangePasswordRequest): Observable<IBaseResponse<string>> {
    return this.httpService.Patch(`/v1/users/mypage/password`, request);
  }

}

