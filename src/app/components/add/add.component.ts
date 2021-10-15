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
import { forEach } from 'lodash';

@Component({
  selector: 'add-modal',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddModalComponent implements OnInit {

  @ViewChild('modal') modal: any;
  form: FormGroup;
  err: string;
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
      urls: [''],
      token: [''],
      import: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.err = null;

      const urls: string[] = this.form.get('urls').value?.split('\n');

      console.log(urls?.length);

      if (urls?.length > 0) {
        const fails = urls.filter(o => !/^http:\/\//.test(o.trim()));

        if (fails.length > 0) {
          this.valid = false;
        } else {
          this.valid = true;
        }
      } else {
        if (this.form.get('import')?.value?.length > 0) {
          this.valid = true;
        } else {
          this.valid = false;
        }
      }
    });

    this.events.subscribe('modal:add', () => {
      this.form.reset();
      this.err = null;
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
        this.err = 'Invalid import data';
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
      const urls: string[] = this.form.get('urls').value.split('\n');
      let ok = 0;
      await this.g.asyncForEach(urls, async (url: string) => {
        try {
          const summary = await this.api.call(`${url}/1/summary`, this.form.get('token').value);
          this.runtime.add({
            url,
            token: this.form.get('token').value,
            id: summary.worker_id,
            version: summary.version
          } as ISavedWorker);
          ok++;
        } catch (err) {
          this.g.toast(`Failed to fetch ${url}`, 'Oh!', 'error', 'top', 5000);
          console.log(err);
        }
      });
      this.loading = false;
      if (ok === urls.length) {
        this.g.toast(`Success!`, '', 'success', 'top', 5000);
        this.modalService.dismissAll();
      }
    }
  }
}
