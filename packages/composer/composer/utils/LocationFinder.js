import API from './API';
import ServiceLocation from '../entities/ServiceLocation';

class LocationFinder {
  static url = 'profiles/get_locations.json';

  static findLocations(profileId, query) {
    const params = {
      profile_id: profileId,
      place: query,
    };

    return API.post(LocationFinder.url, params)
      .catch(() => [])
      .then((response) => {
        const locations = response.locations.data;
        return locations.map((l) =>
          new ServiceLocation(l.id, l.name, l.cover, l.checkins, l.single_line_address)
        );
      });
  }
}
export default LocationFinder;
