class ServiceLocation {
  constructor(id, name, pictureUrl, checkins, address) {
    this.id = id;
    this.name = name;

    if (pictureUrl && pictureUrl.source) {
      this.pictureUrl = pictureUrl.source;
    } else {
      this.pictureUrl = pictureUrl;
    }

    this.checkins = checkins;
    this.address = address;
  }

  get formattedAddressWithCheckins() {
    if (this.checkins) {
      const numbersInGroupsOf3 = /\B(?=(\d{3})+(?!\d))/g;
      const formattedNumber = this.checkins.toString().replace(numbersInGroupsOf3, ',');
      const formattedCheckins = `${formattedNumber} people checked in here`;

      if (this.address) {
        return `${this.address} · ${formattedCheckins}`;
      }

      return formattedCheckins;
    }

    return '';
  }
}

export default ServiceLocation;
