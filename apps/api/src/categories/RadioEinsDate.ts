export class RadioEinsDate {
  public dateFormat: Date;

  constructor(private radioEinsFormat: string) {
    const [datum, uhrzeit] = this.radioEinsFormat.split('_');
    const [date, month, year] = datum.split('-');
    const [hour] = uhrzeit.split('-');

    this.dateFormat = new Date(`${year}-${month}-${date}T${hour}:00:00.000Z`);
  }
}
