import { Injectable } from '@angular/core';
import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  notify;
  constructor() {
    PNotifyButtons;
    PNotify.defaults.icon = '';
    this.notify = PNotify;

  }


  notice(text: string) {
    let notice = this.notify.notice({
      text: text,
      addClass: 'alert alert-success alert-block fade in',
      modules: {
        Buttons: {
          closer: false,
          sticker: false
        }
      }
    });

    notice.on('click', () => {
      notice.close();
    })
  }

  success(text: string) {
    let notice = this.notify.success({
      text: text,
      delay: 2000,
      addClass: 'alert alert-success  notify-success',
      modules: {
        Buttons: {
          closer: false,
          sticker: false
        }
      }
    });

    notice.on('click', () => {
      notice.close();
    })
  }

  error(text: string) {
    let notice = this.notify.error({
      text: text,
      addClass: 'notify-error',
      delay: 2000,
      modules: {
        Buttons: {
          closer: false,
          sticker: false
        }
      }
    });

    notice.on('click', () => {
      notice.close();
    })
  }

  systemError() {

    // notify error to user
    let notice = this.notify.error({
      text: "Quá trình xảy ra lỗi, xin vui lòng thử lại sau",
      addClass: 'notify-error',
      modules: {
        Buttons: {
          closer: false,
          sticker: false
        }
      }
    });

    notice.on('click', () => {
      notice.close();
    })
  }
}
