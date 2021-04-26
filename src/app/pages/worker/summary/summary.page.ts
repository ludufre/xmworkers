import { Component, OnInit, } from '@angular/core';
import { RuntimeService } from 'src/app/engine/runtime.service';
import { Events } from 'src/app/engine/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/engine/global.service';
import { IWorker } from 'src/app/interfaces/worker.interface';
import { ISummary } from 'src/app/interfaces/summary.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-worker-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class WorkerSummaryPage implements OnInit {

  worker: IWorker;

  constructor(
    public runtime: RuntimeService,
    public events: Events,
    public ar: ActivatedRoute,
    public g: GlobalService,
    public router: Router,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    this.worker = this.runtime.viewing;
  }

  isMiningOk(summary: ISummary) {
    return !!summary?.hashrate &&
      !!summary.hashrate?.total &&
      !!summary.hashrate.total[0] &&
      summary.hashrate.total[0] >= .01 &&
      (!!summary?.results?.shares_total ||
        !(summary.results.shares_total - summary.results.shares_good));
  }

  isConnectionOk(summary: ISummary) {
    return !!summary?.connection &&
      !!summary?.connection?.uptime &&
      summary?.connection?.uptime > 0;
  }

  datetime(s: number) {
    if (s === 0) {
      return 'unknown';
    }
    let minutes = Math.floor(s / 60);
    const seconds = s % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    const days = Math.floor(hours / 24);
    hours = hours % 24;
    let output = '';
    if (days > 0) {
      output += `${days} day${days > 1 ? 's' : ''}, `;
    }
    if (hours > 0) {
      output += `${hours} hour${hours > 1 ? 's' : ''}, `;
    }
    if (minutes > 0) {
      output += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
    }
    if (seconds > 0) {
      output += `${seconds} second${seconds > 1 ? 's' : ''}, `;
    }
    return output.substr(0, output.length - 2);
  }

  refresh() {
    this.runtime.getSummary(this.worker);
  }
}
