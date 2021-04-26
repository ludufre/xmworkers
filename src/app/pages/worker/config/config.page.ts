import { Component, OnInit, } from '@angular/core';
import { RuntimeService } from 'src/app/engine/runtime.service';
import { Events } from 'src/app/engine/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/engine/global.service';
import { IWorker } from 'src/app/interfaces/worker.interface';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/engine/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IConfig } from 'src/app/interfaces/config.interface';

@Component({
  selector: 'app-worker-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class WorkerConfigPage implements OnInit {

  worker: IWorker;
  config: string;
  loaded = false;
  err = true;
  invalid = false;

  constructor(
    public runtime: RuntimeService,
    public events: Events,
    public ar: ActivatedRoute,
    public g: GlobalService,
    public router: Router,
    public fb: FormBuilder,
    public api: ApiService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    this.worker = this.runtime.viewing;

    this.getConfig();
  }

  async getConfig(download = false) {
    this.loaded = false;
    this.api.call(`${this.worker.url}/1/config`, this.worker.token).then((config: IConfig) => {
      if (download) {
        this.g.download(JSON.stringify(config, null, 2), 'config.json', 'application/json');
      } else {
        this.config = JSON.stringify(config, null, 2);
        this.err = false;
      }
    }, (err) => {
      console.error(err);
      this.err = true;
    }).finally(() => this.loaded = true);
  }

  download() {
    this.getConfig(true);
  }

  configChange(json: string) {
    this.invalid = !this.g.isJSON(json);
  }

  apply() {
    this.loaded = false;
    this.api.call(`${this.worker.url}/1/config`, this.worker.token, JSON.parse(this.config), 'PUT', 'application/json').then((ret) => {
      console.log(ret);
      this.g.toast('Configuration successfully applied.', 'Success!', 'success');
    }, (err) => {
      this.g.toast('Failed to apply configuration.', 'Oh!', 'error');
    }).finally(() => this.loaded = true);
  }
}
