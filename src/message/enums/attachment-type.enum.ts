import { registerEnumType } from '@nestjs/graphql';

export enum AttachmentType {
  Audio = 'Audio',
  Document = 'Document',
  Image = 'Image',
  Video = 'Video',
}

registerEnumType(AttachmentType, {
  name: 'AttachmentType',
});
