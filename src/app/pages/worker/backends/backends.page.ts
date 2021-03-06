import { Component, OnDestroy, OnInit, } from '@angular/core';
import { RuntimeService } from 'src/app/engine/runtime.service';
import { Events } from 'src/app/engine/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/engine/global.service';
import { IWorker } from 'src/app/interfaces/worker.interface';
import { ISummary } from 'src/app/interfaces/summary.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-worker-backends',
  templateUrl: './backends.page.html',
  styleUrls: ['./backends.page.scss'],
})
export class WorkerBackendsPage implements OnInit, OnDestroy {

  worker: IWorker;
  loaded = false;
  cid: any;

  constructor(
    public runtime: RuntimeService,
    public events: Events,
    public ar: ActivatedRoute,
    public g: GlobalService,
    public router: Router
  ) { }

  ngOnInit() {
    this.worker = this.runtime.viewing;

    this.job();
  }

  ngOnDestroy() {
    clearTimeout(this.cid);
  }

  job() {
    clearTimeout(this.cid);
    this.runtime.getBackends(this.worker).then(() => {
      this.loaded = true;
    }).finally(() => this.cid = setTimeout(this.job.bind(this), this.runtime.refresh.value * 1000));
  }

  priority(p: number) {
    switch (p) {
      case -1: return 'default';
      case 1: return 'below normal';
      case 2: return 'normal';
      case 3: return 'above normal';
      case 4: return 'high';
      case 5: return 'realtime';
    }
  }
}
