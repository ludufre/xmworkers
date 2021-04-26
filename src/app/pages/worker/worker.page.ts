import { Component, OnInit, } from '@angular/core';
import { RuntimeService } from 'src/app/engine/runtime.service';
import { Events } from 'src/app/engine/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/engine/global.service';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.page.html',
  styleUrls: ['./worker.page.scss'],
})
export class WorkerPage implements OnInit {

  menus: IMenu[] = [];

  constructor(
    public runtime: RuntimeService,
    public events: Events,
    public ar: ActivatedRoute,
    public g: GlobalService,
    public router: Router
  ) { }

  ngOnInit() {
    if (!!!this.runtime.viewing) {
      const url = this.ar.snapshot.paramMap.get('url');
      const found = this.runtime.workers.find(o => o.url === url);
      if (!!!found) {
        this.router.navigateByUrl('/');
        return;
      }
      this.runtime.viewing = found;

      console.log(this.ar.snapshot);
    }

    this.menus = [
      {
        title: this.runtime.viewing.id,
        entries: [{
          label: 'Summary',
          icon: 'info-circle',
          path: '/summary',
          active: true
        }, {
          label: 'Connection',
          icon: 'plug',
          path: '/edit'
        }, {
          label: 'Backends',
          icon: 'microchip',
          path: '/backends'
        }, {
          label: 'Configuration',
          icon: 'pen',
          path: '/config'
        }]
      }, /* {
        entries: [{
          label: 'Development',
          icon: 'flask',
          path: '/dev'
        }]
      } */
    ];

    this.events.subscribe('menu:open', (path: string) => {
      this.menus.forEach(o => {
        o.entries.forEach(o2 => {
          if (o2.path === path) {
            this.open(o2);
          }
        });
      });
    });
  }

  open(entry: IMenuEntry) {
    this.menus.map(o => o.entries.map(o2 => o2.active = false));
    entry.active = true;
    this.router.navigateByUrl(`/worker/${encodeURIComponent(this.runtime.viewing.url)}${entry.path}`);
  }
}

export interface IMenu {
  title?: string;
  entries: IMenuEntry[];
}

export interface IMenuEntry {
  label: string;
  icon: string;
  path: string;
  active?: boolean;
}
