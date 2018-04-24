import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { LoginPage } from '../login/login';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currentEvents;
  user: Observable<firebase.User>;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  ref = firebase.database().ref('geolocations/');

  constructor(public navCtrl: NavController,
              public platform: Platform,
              private geolocation: Geolocation,
              private device: Device) {
    platform.ready().then(() => {
      this.initMap();
    });
    this.ref.on('value', resp => {
      this.deleteMarkers();
      snapshotToArray(resp).forEach(data => {
        if(data.uuid !== this.device.uuid) {
          let image = 'assets/imgs/green-bike.png';
          let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);
        } else {
          let image = 'assets/imgs/blue-bike.png';
          let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);
        }
      });
    });
    this.currentEvents = [
        {
            year: 2018,
            month: 4,
            date: 22
        },
        {
            year: 2018,
            month: 6,
            date: 16
        }
    ];
  }

  gotoLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  onDaySelect(ev) {

  }

  onMonthSelect(ev) {
    
  }

  initMap() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
        let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          zoom: 15,
          center: mylocation
        });
      }).catch((error) => {
        console.log('Error getting location ' + error);
      });
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        this.deleteMarkers();
        //this.updateGeolocation(this.device.uuid, data.coords.latitude,data.coords.longitude);
        let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
        let image = 'assets/imgs/blue-bike.png';
        this.addMarker(updatelocation,image);
        this.setMapOnAll(this.map);
      });
  }

  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    this.markers.push(marker);
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  updateGeolocation(uuid, lat, lng) {
    if(localStorage.getItem('mykey')) {
      firebase.database().ref('geolocations/'+localStorage.getItem('mykey')).set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
    } else {
      let newData = this.ref.push();
      newData.set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
      localStorage.setItem('mykey', newData.key);
    }
  }

}

export const snapshotToArray = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};