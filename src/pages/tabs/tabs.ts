import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home'
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { VendorPage } from '../vendor/vendor';
import { TipsPage } from '../tips/tips';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = VendorPage;
  tab5Root = TipsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}