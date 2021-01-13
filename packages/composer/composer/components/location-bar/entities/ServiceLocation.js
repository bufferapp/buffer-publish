class ServiceLocation {
  constructor(id, name, location) {
    this.id = id;
    this.name = name;
    this.location = location;
  }

  get formattedAddress() {
    if (this.location) {
      const { city, country, state, street, zip } = this.location;
      const formattedCity = city && (state || country) ? `${city},` : city;
      const address = [street, formattedCity, state, zip, country]
        .filter(Boolean)
        .join(' ');

      return address;
    }

    return '';
  }
}

export default ServiceLocation;
