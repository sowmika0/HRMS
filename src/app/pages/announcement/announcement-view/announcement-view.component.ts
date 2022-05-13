import { Component, Input, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from '@ngx-gallery/core';

import { AnnouncementAttachment, UpdateAnnouncementRequest } from './../announcement.model';

@Component({
  selector: 'app-announcement-view',
  templateUrl: './announcement-view.component.html',
  styleUrls: ['./announcement-view.component.scss']
})
export class AnnouncementViewComponent implements OnInit {

  @Input('announcement') announcement: UpdateAnnouncementRequest = new UpdateAnnouncementRequest();

  images: GalleryItem[] = [];
  imageAttachments: AnnouncementAttachment[] = [];
  documentAttachments: AnnouncementAttachment[] = [];

  constructor() { }

  ngOnInit() {
    this.imageAttachments = this.announcement.attachments.filter(f => f.type === 'Image');
    this.documentAttachments = this.announcement.attachments.filter(f => f.type === 'Document');
    this.imageAttachments.map(i => {
      const image: ImageItem = new ImageItem({ src: i.fileUrl, thumb: i.fileUrl });
      this.images.push(image);
    });
  }

}
