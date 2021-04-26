import { Injectable } from '@angular/core';
import { FaIconLibrary, FaConfig } from '@fortawesome/angular-fontawesome';
import { faGithub, faReddit, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faBars,
  faAdjust,
  faCog,
  faPlus,
  faExclamationTriangle,
  faSpinner,
  faCopy,
  faPen,
  faMicrochip,
  faPlug,
  faInfoCircle,
  faFlask,
  faSyncAlt,
  faInfinity,
  faTrashAlt,
  faCheck,
  faCheckCircle,
  faDownload,
  faPause,
  faPlay
} from '@fortawesome/free-solid-svg-icons';

@Injectable({ providedIn: 'root' })
export class IconService {

  constructor(
    private fa: FaIconLibrary,
    private fac: FaConfig
  ) {
    this.fac.defaultPrefix = 'fas';
    this.fac.fixedWidth = true;
    this.fac.fallbackIcon = faAdjust;
    this.fa.addIcons(
      faBars,
      faAdjust,
      faCog,
      faPlus,
      faTwitter,
      faReddit,
      faGithub,
      faTelegram,
      faExclamationTriangle,
      faSpinner,
      faCopy,
      faPen,
      faMicrochip,
      faPlug,
      faInfoCircle,
      faFlask,
      faSyncAlt,
      faInfinity,
      faTrashAlt,
      faCheck,
      faCheckCircle,
      faDownload,
      faPause,
      faPlay
    );
  }
}
