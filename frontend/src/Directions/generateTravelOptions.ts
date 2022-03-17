const generateTravelOptions = (
  mode: google.maps.TravelMode,
  arrivalTime?: Date
) => {
  switch (mode) {
    case google.maps.TravelMode.TRANSIT:
      return {
        transitOptions: {
          arrivalTime,
          modes: [google.maps.TransitMode.BUS],
        },
      };
    case google.maps.TravelMode.WALKING:
    case google.maps.TravelMode.BICYCLING:
      return {};
    case google.maps.TravelMode.DRIVING:
    default:
      return {
        drivingOptions: {
          departureTime: new Date(Date.now()),
          trafficModel: google.maps.TrafficModel.PESSIMISTIC,
        },
      };
  }
};

export default generateTravelOptions;
