// We can remove this file once the footer API is ready

import Reykjavík from '@/rz/view/imgs/reykjavik.png';
import Akureyri from '@/rz/view/imgs/akureyri.png';
import Egilsstaðir from '@/rz/view/imgs/egilsstredir.png';
import Selfoss from '@/rz/view/imgs/selfoss.png';
import Reykjanesbær from '@/rz/view/imgs/reykjanesber.png';

// Announcement bar data
import AnnouncementIcon from '@/rz/view/imgs/AnnouncementIcon.png';

// Footer stores ata
export const storesList = [
  {
    id: 0,
    title: 'Reykjavík',
    img: Reykjavík,
    virkirDagarFrom: '10:00',
    virkirDagarTo: '18:00',
    laugardagurFrom: '11:00',
    laugardagurTo: '18:00',
    sunnudagurFrom: '13:00',
    sunnudagurTo: '17:00',
    detailText: 'Suðurlandsbraut 26',
    contactNumber: '414-1700',
    googleMapLocation: 'https://goo.gl/maps/MMSwhKRDAPLRtUUX9',
  },
  {
    id: 1,
    title: 'Akureyri',
    img: Akureyri,
    virkirDagarFrom: '10:00',
    virkirDagarTo: '18:00',
    laugardagurFrom: '10:00',
    laugardagurTo: '17:00',
    sunnudagurFrom: '13:00',
    sunnudagurTo: '17:00',
    detailText: 'Glerártorgi',
    contactNumber: '414-1730',
    googleMapLocation: 'https://goo.gl/maps/SGfhHNbR3G5cLLAH9',
  },
  {
    id: 2,
    title: 'Egilsstaðir',
    img: Egilsstaðir,
    virkirDagarFrom: '10:00',
    virkirDagarTo: '18:00',
    laugardagurFrom: '11:00',
    laugardagurTo: '16:00',
    detailText: 'Kaupvangi 6',
    contactNumber: '414-1735',
    googleMapLocation: 'https://goo.gl/maps/RnkeC5y3Aq6gm3Ka7',
  },
  {
    id: 3,
    title: 'Selfoss',
    img: Selfoss,
    virkirDagarFrom: '10:00',
    virkirDagarTo: '18:00',
    laugardagurFrom: '11:00',
    laugardagurTo: '16:00',
    detailText: 'Austurvegur 34',
    contactNumber: '414-1745',
    googleMapLocation: 'https://goo.gl/maps/JoPLtyZm9WJYeH8Z9',
  },
  {
    id: 4,
    title: 'Reykjanesbær',
    img: Reykjanesbær,
    virkirDagarFrom: '10:00',
    virkirDagarTo: '18:00',
    laugardagurFrom: '11:00',
    laugardagurTo: '16:00',
    detailText: 'Hafnargötu 90',
    contactNumber: '414-1740',
    googleMapLocation: 'https://goo.gl/maps/xQE1f1Gc1sn3SCbW9',
  },
];

// Announcebar Data
export const announcementData = {
  img: AnnouncementIcon,
  text: 'Ókeypis heimsinding í dag',
};
