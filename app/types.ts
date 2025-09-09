// src/types.ts
export interface Event {
  id: string;
  date: string;
  title: string;
  type: 'note' | 'reminder';
  description?: string;
  createdAt: string;
  reminderTime?: string;
}

export interface Holiday {
  date: string;
  name: string;
  localName?: string;
  countryCode?: string;
  fixed?: boolean;
}

export interface MarkedDate {
  selected?: boolean;
  marked?: boolean;
  selectedColor?: string;
  dotColor?: string;
  customStyles?: {
    container?: object;
    text?: object;
  };
  dots?: Array<{color: string; key: string}>;
}