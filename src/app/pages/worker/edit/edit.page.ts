import { Component, OnInit, } from '@angular/core';
import { RuntimeService } from 'src/app/engine/runtime.service';
import { Events } from 'src/app/engine/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/engine/global.service';
import { IWorker } from 'src/app/interfaces/worker.interface';
import { ISummary } from 'src/app/interfaces/summary.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/engine/api.service';
import { ISavedWorker } from 'src/app/interfaces/saved-worker.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-worker-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class WorkerEditPage implements OnInit {

  worker: IWorker;
  form: FormGroup;

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

    this.form = this.fb.group({
      url: [this.worker.url],
      token: [this.worker.token]
    });
  }

  async submit(ev: CustomEvent) {
    ev.preventDefault();

    if (!this.form.valid) {
      return;
    }

    this.api.call(`${this.form.get('url').value}/1/summary`, this.form.get('token').value).then((summary: ISummary) => {
      this.runtime.add({
        url: this.form.get('url').value,
        token: this.form.get('token').value,
        id: summary.worker_id,
        version: summary.version
      } as ISavedWorker);
      this.g.alert('Worker was successfully changed.', 'Success!', 'success');
    }, (err) => {
      console.error(err);
      this.g.alert('Failed to fetch.', 'Oh!', 'error');
    });
  }

  delete() {
    this.runtime.remove(this.worker.url);
    this.router.navigateByUrl('/');
    this.modalService.dismissAll();
  }
}
