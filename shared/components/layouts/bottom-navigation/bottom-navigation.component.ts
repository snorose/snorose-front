import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

interface INavigation {
  name: string;
  icon: string;
  url: string;
  select: boolean;
}

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrl: './bottom-navigation.component.scss'
})
export class BottomNavigationComponent implements OnInit {

  private readonly router = inject(Router);

  public navigations: INavigation[] = [
    { name: '메인홈', icon: 'home', url: '/main', select: false },
    { name: '게시판', icon: 'lists', url: '/board', select: false },
    { name: '시험후기', icon: 'local_library', url: '/review', select: false },
    { name: '마이페이지', icon: 'face_6', url: '/membership/myPage', select: false }
  ]
  public currentNavigation: INavigation = this.navigations.first();

  ngOnInit() {
    const currentUrl = this.router.url;

    this.navigations.forEach(navigation => {
      if (navigation.url === currentUrl) {
        navigation.select = true;
        this.currentNavigation = navigation;
      }
    });
  }

  navigationClick(navigation: INavigation) {
    this.navigations.forEach(nav => nav.select = false);
    navigation.select = true;
    this.router.navigateByUrl(navigation.url);
  }

}
