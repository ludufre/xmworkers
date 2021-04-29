import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { IBackend } from '../interfaces/backend.interface';
import { ISavedWorker } from '../interfaces/saved-worker.interface';
import { ISummary } from '../interfaces/summary.interface';
import { IWorker, WorkerStatus } from '../interfaces/worker.interface';
import { ApiService } from './api.service';
import { GlobalService } from './global.service';
import { SecureStorageService } from './secure-storage.service';

@Injectable({ providedIn: 'root' })
export class RuntimeService {

  workers: IWorker[] = [];
  refresh = new BehaviorSubject<number>(5);
  viewing: IWorker;
  latest: string;
  cid: any;

  constructor(
    public ss: SecureStorageService,
    public api: ApiService,
    public g: GlobalService
  ) {
    this.getWorkers();
    this.getTimeout();

    this.refresh.subscribe(seconds => {
      this.ss.set('refresh', seconds);
    });
  }

  async getWorkers() {
    const savedWorkers: ISavedWorker[] = (await this.ss.get('workers')) || [];
    this.workers = savedWorkers.map(worker => ({
      ...worker,
      status: WorkerStatus.ERROR
    } as IWorker));
    this.autoRefresh();

    this.api.call(`https://api.github.com/repos/xmrig/xmrig/releases/latest`).then((latest: any) => {
      this.latest = latest.tag_name.replace(/[^0-9\.]/, '');
    });
  }

  async getTimeout() {
    const saved = (await this.ss.get('refresh') as number) || 5;
    this.refresh.next(saved);
  }

  async autoRefresh() {
    clearTimeout(this.cid);

    for (const worker of (this.workers || [])) {
      this.getSummary(worker);
    }

    this.cid = setTimeout(() => this.autoRefresh(), this.refresh.value * 1000);
  }

  checkOutdate() {
    const checkOutdated = this.workers.filter(o => !!o?.summary && o.summary.version !== this.latest);
    return checkOutdated.length > 0;
  }

  getSummary(worker: IWorker): Promise<void> {
    return new Promise((ok) => {
      this.api.call(`${worker.url}/1/summary`, worker.token).then((summary: ISummary) => {
        const save = worker.id !== summary.worker_id || worker.version !== summary.version;
        worker.summary = summary;
        worker.id = summary.worker_id;
        worker.version = summary.version;
        if (save) {
          this.ss.addOrUpdateWorker(worker);
        }

        if (!!!summary.connection || !!!summary.hashrate || !!!summary.results) {
          worker.status = WorkerStatus.ERROR;
        } else if (
          !!!summary.hashrate?.total[0] ||
          summary.hashrate?.total[0] < .1 ||
          (summary.results?.shares_total > 0 &&
            summary.results?.shares_total - summary.results?.shares_good > 0) ||
          summary.connection?.uptime === 0
        ) {
          worker.status = WorkerStatus.WARNING;
        } else {
          worker.status = WorkerStatus.OK;
        }
      }, (err) => {
        worker.status = WorkerStatus.ERROR;
        worker.summary = null;
      }).finally(() => {
        worker.last = moment().unix();
        ok();
      });
    });
  }

  getBackends(worker: IWorker): Promise<void> {
    return new Promise((ok) => {
      this.api.call(`${worker.url}/2/backends`, worker.token).then((backends: IBackend[]) => {
        worker.backends = backends.filter(o => o.type === 'cpu');
      }, (err) => {
        worker.backends = null;
      }).finally(() => {
        worker.last = moment().unix();
        ok();
      });
    });
  }

  async add(workers: ISavedWorker | ISavedWorker[], replace = false) {
    if (replace) {
      await this.ss.set('workers', []);
    }
    await this.g.asyncForEach(Array.isArray(workers) ? workers : [workers], async (worker: ISavedWorker) => {
      await this.ss.addOrUpdateWorker(worker);
    });
    await this.getWorkers();
  }

  async remove(url: string) {
    await this.ss.removeWorker(url);
    await this.getWorkers();
  }
}
