import { Component, OnInit } from '@angular/core';
import { IconService } from './engine/icon.service';
import { RuntimeService } from './engine/runtime.service';
import { SecureStorageService } from './engine/secure-storage.service';
import { SwService } from './engine/sw.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    public sw: SwService,
    public ss: SecureStorageService,
    public icon: IconService,
    public runtime: RuntimeService
  ) { }

  ngOnInit() { }
}
