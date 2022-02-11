import { injectComponent } from '@/roanuz/lib/dep';
import { RZHead } from '../document';
import { RZAppStyle } from '../style';
import { RZBrandsBarView } from '../view/brandsBar';
import { RZAnnouncementBar } from '../view/announcement';
import { RZPageBottomContentView } from '../view/bottomContent';
import { RZServicesTree } from '../lib/servicesTree';

export function dependencyRegister() {
  injectComponent('AdditionalHead', RZHead);
  injectComponent('AppStyle', RZAppStyle);
  injectComponent('BrandsBarView', RZBrandsBarView);
  injectComponent('TopContentView', RZAnnouncementBar);
  injectComponent('BottomContentView', RZPageBottomContentView);
  injectComponent('ServicesTree', RZServicesTree);
}
