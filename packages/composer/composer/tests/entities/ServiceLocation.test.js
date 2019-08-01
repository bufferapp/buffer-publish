import ServiceLocation from '../../entities/ServiceLocation';

// Example data for creating a service location object
const id = '3123';
const name = 'Los Angeles';
const pictureUrl = 'https://example.com/image.jpeg';
const checkins = 1312322333;
const address = 'LA, USA';

describe('constructor', () => {
  it('creates a new object with right attributes', () => {
    const sl = new ServiceLocation(id, name, pictureUrl, checkins, address);

    expect(sl.id).toBe(id);
    expect(sl.name).toBe(name);
    expect(sl.pictureUrl).toBe(pictureUrl);
    expect(sl.checkins).toBe(checkins);
    expect(sl.address).toBe(address);
  });

  it('extracts pictureUrl if it has data when creating object', () => {
    const pictureUrlWithData = {
      source: 'https://example.com/image2.jpeg',
    };

    const sl = new ServiceLocation(id, name, pictureUrlWithData, checkins, address);

    expect(sl.pictureUrl).toBe('https://example.com/image2.jpeg');
  });
});


describe('formattedAddressWithCheckins', () => {
  it('returns address and formatted checkins if both are present', () => {
    const sl = new ServiceLocation(id, name, pictureUrl, checkins, address);

    expect(sl.formattedAddressWithCheckins).toBe(
      `${address} · 1,312,322,333 people checked in here`
    );
  });

  it('returns only formatted checkins if address not present', () => {
    const sl = new ServiceLocation(id, name, pictureUrl, checkins);

    expect(sl.formattedAddressWithCheckins).toBe('1,312,322,333 people checked in here');
  });


  it('returns empty string if checkins not present', () => {
    const sl = new ServiceLocation(id, name, pictureUrl);

    expect(sl.formattedAddressWithCheckins).toBe('');
  });
});
