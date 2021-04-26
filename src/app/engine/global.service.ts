import { Injectable } from '@angular/core';
import Swal, { SweetAlertPosition } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class GlobalService {

  constructor() { }

  async asyncForEach(array: any, callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  isJSON(str: any) {
    if (typeof str === 'object') {
      return true;
    }
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  toast(
    text: string,
    title: string = null,
    icon: 'warning' | 'error' | 'success' | 'info' | 'question' = 'info',
    position: SweetAlertPosition = 'top',
    timer = 1500
  ) {
    Swal.fire({
      title: title || text,
      text: !!title ? text : null,
      timer,
      icon,
      toast: true,
      timerProgressBar: true,
      position,
      showConfirmButton: false
    });
  }


  alert(
    text: string,
    title: string = null,
    icon: 'warning' | 'error' | 'success' | 'info' | 'question' = 'info',
    position: SweetAlertPosition = 'center',
    timer = 0
  ): Promise<any> {
    return Swal.fire({
      title: title || text,
      text: !!title ? text : null,
      timer,
      icon,
      toast: false,
      timerProgressBar: true,
      position,
      showConfirmButton: true,
      heightAuto: false
    });
  }

  ask(
    text: string,
    title: string = null,
    labels: [string, string],
    icon: 'warning' | 'error' | 'success' | 'info' | 'question' = 'question',
    position: SweetAlertPosition = 'center'
  ): Promise<void> {
    return new Promise(async (ok, nook) => {
      const clicked = await Swal.fire({
        title: title || text,
        text: !!title ? text : null,
        icon,
        toast: false,
        timerProgressBar: true,
        position,
        heightAuto: false,

        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: labels[1],
        confirmButtonText: labels[0],
      });
      if (clicked.isConfirmed === true) {
        return ok();
      } else {
        return nook();
      }
    });
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) { return '0 Bytes'; }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  download(content: string, name: string, type: string = 'application/octet-stream') {
    // Avaliar utilização do novo método base64ToBlob
    const newBlob = new Blob([content], { type });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);

    const link = document.createElement('a');
    link.href = data;
    link.download = name;
    link.target = '_blank';
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }
}
