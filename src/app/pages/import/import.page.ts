import { Component, OnInit, } from '@angular/core';
import { RuntimeService } from 'src/app/engine/runtime.service';
import { Events } from 'src/app/engine/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as SimpleBase from 'simple-base';
import { GlobalService } from 'src/app/engine/global.service';
import { ISavedWorker } from 'src/app/interfaces/saved-worker.interface';

@Component({
  selector: 'app-import',
  templateUrl: './import.page.html',
  styleUrls: ['./import.page.scss'],
})
export class ImportPage implements OnInit {

  incoming: string;

  constructor(
    public runtime: RuntimeService,
    public events: Events,
    public ar: ActivatedRoute,
    public g: GlobalService,
    public router: Router
  ) { }

  ngOnInit() {
    this.incoming = this.ar.snapshot.paramMap.get('data');
  }

  async import() {
    const decoded = SimpleBase.decode(this.incoming, 58);
    if (!this.g.isJSON(decoded)) {
      this.g.alert('Invalid Content.', 'Oh', 'error');
      return;
    }
    const data = JSON.parse(decoded);
    this.runtime.refresh.next(data[1]);
    await this.runtime.add(data[2].map((w: any) => ({
      url: `http://${w[0]}`,
      token: w[1],
      id: w[2],
      version: w[3]
    } as ISavedWorker)), true);
    this.router.navigateByUrl('/');
  }
}
