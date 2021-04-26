import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/engine/api.service';
import { Events } from 'src/app/engine/events.service';
import { GlobalService } from 'src/app/engine/global.service';
import { RuntimeService } from 'src/app/engine/runtime.service';
import { IWorker } from 'src/app/interfaces/worker.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    public api: ApiService,
    public router: Router,
    public events: Events,
    public runtime: RuntimeService,
    public g: GlobalService
  ) { }

  ngOnInit() { }

  openWorker(worker: IWorker) {
    this.runtime.viewing = worker;
    this.router.navigateByUrl(`/worker/${encodeURIComponent(worker.url)}`);
  }

  openAddModal() {
    this.events.publish('modal:add');
  }

  workerTrackBy(index: number, item: IWorker) {
    return item.url;
  }

  actions(worker: IWorker, type: number) {
    switch (type) {
      case 1:
      case 2:
        worker.actionsLoading = true;
        this.api.call(`${worker.url}/json_rpc`, worker.token, { method: type === 1 ? 'pause' : 'resume' }).then(() => {
          worker.summary.paused = type === 1;
          this.g.toast(`Action performed.`, 'Success!', 'success');
        }, (err) => {
          this.g.toast(`Can't perform this action.`, 'Oh!', 'error');
        }).finally(() => worker.actionsLoading = false);
        break;
    }
  }

  sum(index: number) {
    let total = 0;
    for (const o of this.runtime.workers) {
      if (index === -1) {
        if (o.summary?.hashrate?.highest > total) {
          total = o.summary?.hashrate?.highest;
        }
      } else {
        total += o.summary?.hashrate?.total[index];
      }
    };
    return total;
  }

  workersCount() {
    return this.runtime.workers.filter(o => !!o.summary && !o.summary.paused).length;
  }

  resultsGood() {
    let total = 0;
    for (const o of this.runtime.workers) {
      total += o.summary?.results?.shares_good || 0;
    }
    return total;
  }

  resultsBad() {
    let total = 0;
    for (const o of this.runtime.workers) {
      total += (o.summary?.results?.shares_total || 0) - (o.summary?.results?.shares_good || 0);
    }
    return total;
  }

  resultsAvg() {
    let total = 0;
    for (const o of this.runtime.workers) {
      if (!o.summary?.paused) {
        total += o.summary?.results?.avg_time || 0;
      }
    }
    if (total === 0) { return 0; }
    return (total / this.workersCount());
  }
}
