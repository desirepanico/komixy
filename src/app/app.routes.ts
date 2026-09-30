import { Routes } from '@angular/router';
import { HomePage } from './home/pages/home-page/home-page';
export const routes: Routes = [
  //test
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'releases',
    component: HomePage,
  },
];
