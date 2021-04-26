import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/engine/api.service';
import { Events } from 'src/app/engine/events.service';
import { RuntimeService } from 'src/app/engine/runtime.service';
import { ISavedWorker } from 'src/app/interfaces/saved-worker.interface';
import { ISummary } from 'src/app/interfaces/summary.interface';
import * as SimpleBase from 'simple-base';
import { GlobalService } from 'src/app/engine/global.service';

@Component({
  selector: 'add-modal',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddModalComponent implements OnInit {

  @ViewChild('modal') modal: any;
  form: FormGroup;
  err = false;
  loading = false;
  valid = false;

  constructor(
    public router: Router,
    public events: Events,
    public modalService: NgbModal,
    public fb: FormBuilder,
    public api: ApiService,
    public runtime: RuntimeService,
    public g: GlobalService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      url: [''],
      token: [''],
      import: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.err = null;

      if (
        /^http:\/\//.test(this.form.get('url').value) ||
        this.form.get('import')?.value?.length > 0
      ) {
        this.valid = true;
      } else {
        this.valid = false;
      }
    });

    this.events.subscribe('modal:add', () => {
      this.form.reset();
      this.err = false;
      this.loading = false;
      this.modalService.open(this.modal, { size: 'lg' });
    });
  }

  async submit(ev: CustomEvent) {
    ev.preventDefault();
    this.loading = true;

    if (!this.valid) {
      return;
    }

    if (this.form.get('import')?.value?.length > 0) {
      let encoded = this.form.get('import').value;
      encoded = encoded.replace('http://workers.xmrig.info/import/', '');
      const decoded = SimpleBase.decode(encoded, 58);
      if (!this.g.isJSON(decoded)) {
        this.loading = false;
        this.err = true;
        return;
      }
      const data = JSON.parse(decoded);
      await this.runtime.add(data[2].map((w: any) => ({
        url: `http://${w[0]}`,
        token: w[1],
        id: w[2],
        version: w[3]
      } as ISavedWorker)), true);
      this.modalService.dismissAll();
    } else {
      this.api.call(`${this.form.get('url').value}/1/summary`, this.form.get('token').value).then((summary: ISummary) => {
        this.runtime.add({
          url: this.form.get('url').value,
          token: this.form.get('token').value,
          id: summary.worker_id,
          version: summary.version
        } as ISavedWorker);
        this.modalService.dismissAll();
      }, (err) => {
        console.error(err);
        this.err = true;
      }).finally(() =>
        this.loading = false
      );
    }
  }
}
