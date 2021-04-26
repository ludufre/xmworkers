import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate, UnrecoverableStateEvent, UpdateActivatedEvent, UpdateAvailableEvent } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { version } from 'src/version';
import { Events } from './events.service';
import { GlobalService } from './global.service';

@Injectable({ providedIn: 'root' })
export class SwService {

  goRoot = false;

  constructor(
    public updates: SwUpdate,
    public appRef: ApplicationRef,
    public g: GlobalService,
    public events: Events
  ) {
    updates.available.subscribe(async (event: UpdateAvailableEvent) => {
      const appData = event.available.appData as IAppData;

      this.g.ask(
        `A new version is avaiable. ${appData?.version !== version ? `<br>Current: <span style="color: red">${version}</span> - New: <span style="color: green;">${appData.version}</span>` : ''}`,
        'Update now?',
        ['Update', 'Later']
      ).then(
        _ => {
          updates.activateUpdate().then(() => {
            if (this.goRoot) {
              document.location.href = '/';
            } else {
              document.location.reload();
            }
          });
        },
        _ => null
      );
    });

    updates.activated.subscribe((event: UpdateActivatedEvent) => {
      const appData = event.current.appData as IAppData;
      this.g.alert(`New version installed: ${appData?.version}.`, 'Success!', 'success', 'center');
    });

    updates.unrecoverable.subscribe((event: UnrecoverableStateEvent) => {
      this.g.alert(`The current version is corrupted. The application will be restarted.`, 'An error has occurred!', 'error', 'center').then(_ => document.location.href = '/');
    });

    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());

    this.events.subscribe('sw:check', () => {
      this.check().then(() => {
        this.updates.checkForUpdate();
      }, () => {
        this.g.alert('This is currently the newest version available.', 'You’re up to date!', 'success');
      }).catch(() => {
        this.g.alert(`Can't check for update`, 'Oh!', 'error');
      });
    });
  }

  check(goRoot = false): Promise<any> {
    this.goRoot = goRoot;
    if (!this.updates.isEnabled) {
      return Promise.resolve(false);
    }
    return this.updates.checkForUpdate();
  }
}

export interface IAppData {
  version: string;
}
