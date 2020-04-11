import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
// import { SocialService } from './services/social.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent {
  constructor(
    public translate: TranslateService,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    public titleService: Title,
    // private socialService: SocialService
  ) {

    this.titleService.setTitle(window.location.host);
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/search.svg'));

    iconRegistry.addSvgIcon(
      'check-box-blank',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/check_box_blank.svg'));

    iconRegistry.addSvgIcon(
      'check-box-checked',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/check_box_checked.svg'));

    iconRegistry.addSvgIcon(
      'arrow-expand',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow-expand.svg'));

    iconRegistry.addSvgIcon(
      'expand-less',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/expand_less.svg'));

    iconRegistry.addSvgIcon(
      'expand-more',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/expand_more.svg'));

    iconRegistry.addSvgIcon(
      'perm-identity',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/perm_identity.svg'));

    iconRegistry.addSvgIcon(
      'visibility',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/visibility.svg'));

    iconRegistry.addSvgIcon(
      'visibility-off',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/visibility_off.svg'));

    iconRegistry.addSvgIcon(
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg'));

    iconRegistry.addSvgIcon(
      'shopping-cart',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/shopping_cart.svg'));

    iconRegistry.addSvgIcon(
      'new-releases',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/new_releases.svg'));

    iconRegistry.addSvgIcon(
      'dashboard',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/dashboard.svg'));

    iconRegistry.addSvgIcon(
      'business-center',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/business_center.svg'));

    iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add.svg'));

    iconRegistry.addSvgIcon(
      'remove',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/remove.svg'));

    iconRegistry.addSvgIcon(
      'remove-1',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/remove-1.svg'));

    iconRegistry.addSvgIcon(
      'cancel-presentation',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cancel_presentation.svg'));

    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/close.svg'));

    iconRegistry.addSvgIcon(
      'thumb-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/thumb-up.svg'));

    iconRegistry.addSvgIcon(
      'comment',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/comment.svg'));

    iconRegistry.addSvgIcon(
      'facebook',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg'));

    iconRegistry.addSvgIcon(
      'notification',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/notification.svg'));

    iconRegistry.addSvgIcon(
      'block',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/block.svg'));

    iconRegistry.addSvgIcon(
      'unblock',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/unblock.svg'));

    iconRegistry.addSvgIcon(
      'edit',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/edit.svg'));

    iconRegistry.addSvgIcon(
      'delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/delete.svg'));

    iconRegistry.addSvgIcon(
      'confirm',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/confirm.svg'));

    iconRegistry.addSvgIcon(
      'extend',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/extend.svg'));

    iconRegistry.addSvgIcon(
      'accept',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/accept.svg'));

    iconRegistry.addSvgIcon(
      'refuse',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/refuse.svg'));

    iconRegistry.addSvgIcon(
      'cart',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cart.svg'));

    iconRegistry.addSvgIcon(
      'info',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/info.svg'));

    iconRegistry.addSvgIcon(
      'product-delivery',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/product/product-delivery.svg'));
    iconRegistry.addSvgIcon(
      'gift-card',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/product/gift-card.svg'));
  }

  title = 'dashboard';
}
