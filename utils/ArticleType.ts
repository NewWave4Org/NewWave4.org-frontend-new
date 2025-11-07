export type ArticleType = 'NEWS' | 'EVENT' | 'PROGRAM' | 'PROJECT';

export enum ArticleTypeEnum {
  NEWS = 'NEWS',
  EVENT = 'EVENT',
  PROGRAM = 'PROGRAM',
  PROJECT = 'PROJECT',
}

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export enum ArticleStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum ArticleSortEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  NEW_FIRST = 'FIRST NEW',
  OLD_FIRST = 'FIRST OLD',
}
