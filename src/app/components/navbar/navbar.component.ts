import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from 'src/app/engine/events.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  collapsed = true;

  constructor(
    public router: Router,
    public events: Events
  ) { }

  ngOnInit(): void {
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  openAddModal() {
    this.events.publish('modal:add');
  }
}
