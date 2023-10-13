/* eslint-disable no-inline-comments */
export interface IPoint {
  salePointName: string;
  address: string;
  status: string;
  openHours: IPointOpenHour;
  rko: boolean;
  openHoursIndividual: IPointOpenHour;
  officeType: string;
  salePointFormat: string;
  suoAvailability: string;
  hasRamp: boolean;
  latitude: number;
  longitude: number;
  metroStation: string;
  distance: number;
  kep: boolean;
  myBranch: boolean;
}

export interface IPointOpenHour {
  days: string;
  hours: string;
}

export interface IPointQuery {
  [key: string]: any;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface IPointBookBody {
  phone: string; //номер телефона
  name: string; //имя клиента
  surname: string; //фамилия клиента
  time: string; //date-time
  serviceType: string;
}