import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/engine/api.service';
import { Events } from 'src/app/engine/events.service';
import { RuntimeService } from 'src/app/engine/runtime.service';
import { GlobalService } from 'src/app/engine/global.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'export-modal',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportModalComponent implements OnInit {

  @ViewChild('modal') modal: any;
  url = 'Loading...';

  constructor(
    public router: Router,
    public events: Events,
    public modalService: NgbModal,
    public fb: FormBuilder,
    public api: ApiService,
    public runtime: RuntimeService,
    public g: GlobalService,
    public cp: ClipboardService
  ) { }

  ngOnInit(): void {
    this.events.subscribe('modal:export', (b58: string) => {
      this.url = `${window.location.origin}/import/${b58}`;
      this.modalService.open(this.modal, { size: 'lg' });
    });
  }

  copy() {
    this.cp.copy(this.url);
    this.modalService.dismissAll();
  }
}
