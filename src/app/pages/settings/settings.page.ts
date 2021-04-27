import { Component, OnInit, } from '@angular/core';
import { RuntimeService } from 'src/app/engine/runtime.service';
import * as SimpleBase from 'simple-base';
import { Events } from 'src/app/engine/events.service';
import { version } from 'src/version';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  refresh: number;
  version = version;

  constructor(
    public runtime: RuntimeService,
    public events: Events
  ) { }

  ngOnInit() {
    this.refresh = this.runtime.refresh.value;
  }

  onChange(ev: number) {
    this.runtime.refresh.next(ev);
  }

  export() {
    const data = [
      1,
      [this.runtime.refresh.value],
      this.runtime.workers.map(o => ([
        o.url.replace(/http:\/\/|https:\/\//, ''),
        o.token,
        o.id,
        o.version
      ]))
    ];
    const b58 = SimpleBase.encode(JSON.stringify(data), 58);
    this.events.publish('modal:export', b58);
  }
}
