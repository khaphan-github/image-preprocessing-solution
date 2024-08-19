export enum MediaType {
  IMAGE,
  VIDEO,
  AUDIO,
  DOCUMENT,
  OTHER,
}

export class MediaModel {
  private idValue: string;
  private mediaNameValue: string;
  private createdTimeValue: Date;
  private updatedTimeValue: Date;
  private formatValue: string;
  private mediaTypeValue: MediaType;
  private sizeValue: number;
  private resolutionValue: string;
  private metadataValue: Object;

  constructor(
    id: string,
    mediaName: string,
    createdTime: Date,
    updatedTime: Date,
    format: string,
    mediaType: MediaType,
    size: number,
    resolution: string,
    metadata: Object,
  ) {
    this.idValue = id;
    this.mediaNameValue = mediaName;
    this.createdTimeValue = createdTime;
    this.updatedTimeValue = updatedTime;
    this.formatValue = format;
    this.mediaTypeValue = mediaType;
    this.sizeValue = size;
    this.resolutionValue = resolution;
    this.metadataValue = metadata;
  }

  // Getters
  get id(): string {
    return this.idValue;
  }

  get mediaName(): string {
    return this.mediaNameValue;
  }

  get createdTime(): Date {
    return this.createdTimeValue;
  }

  get updatedTime(): Date {
    return this.updatedTimeValue;
  }

  get format(): string {
    return this.formatValue;
  }

  get mediaType(): MediaType {
    return this.mediaTypeValue;
  }

  get size(): number {
    return this.sizeValue;
  }

  get resolution(): string {
    return this.resolutionValue;
  }

  get metadata(): Object {
    return this.metadataValue;
  }

  // Setters
  set id(value: string) {
    this.idValue = value;
  }

  set mediaName(value: string) {
    this.mediaNameValue = value;
  }

  set createdTime(value: Date) {
    this.createdTimeValue = value;
  }

  set updatedTime(value: Date) {
    this.updatedTimeValue = value;
  }

  set format(value: string) {
    this.formatValue = value;
  }

  set mediaType(value: MediaType) {
    this.mediaTypeValue = value;
  }

  set size(value: number) {
    this.sizeValue = value;
  }

  set resolution(value: string) {
    this.resolutionValue = value;
  }

  set metadata(value: Object) {
    this.metadataValue = value;
  }
}
