import { ActionIcon } from "@mantine/core";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { DirectionsService, DirectionsRenderer, } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { Bus, Car } from "tabler-icons-react";
import useEvents from "../EventsContext/useEvents";
import { GoogleEvent } from "../types";
import styles from "./directions.module.css";
import formatTime, { getLeaveAt, getMinutesFromDuration } from "./formatTime";
import generateTravelOptions from "./generateTravelOptions";
const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = {
  lat: 49.2606,
  lng: -123.246,
};

type GoogleMapWrapperProps = {
  travelMode: string;
  setTravelMode: (travelMode: string) => void;
};

const GoogleMapWrapper = ({ travelMode, setTravelMode }: GoogleMapWrapperProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  });
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState<any>(null);
  const [origin, setOrigin] = useState<null | google.maps.Place>({
    query: "5983 Gray Ave.",
  });
  const events = useEvents();
  // const [travelMode, setTravelMode] = useState<google.maps.TravelMode>("DRIVING" as any);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [destination, setDestination] = useState<null | google.maps.Place>(null);
  const [duration, setDuration] = useState<number>();
  const [errorState, setErrorState] = useState<any>({ error: false });
  // Get directions to first meeting
  useEffect(() => {
    let firstEvent = events.find((event: GoogleEvent) => !!event.event.location);
    if (firstEvent) {
      setDestination({ query: firstEvent.event.location });
      setSelectedEvent(firstEvent);
    }

  }, [events])

  useEffect(() => {
    setDirections(null);
  }, [travelMode])

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return null;
  }

  if (errorState.error) {
    return <div>
      There was an error getting directions to your first meeting
    </div>
  }

  if (!directions) {
    return <GoogleMap
      mapContainerStyle={ containerStyle }
      center={ center }
      zoom={ 10 }
      onLoad={ onLoad }
      onUnmount={ onUnmount }
      options={ { streetViewControl: false, mapTypeControl: false, fullscreenControl: false } }
    >
      { origin != null && destination != null &&
        <DirectionsService
          options={ {
            origin,
            destination,
            travelMode: travelMode as google.maps.TravelMode,
            ...generateTravelOptions(travelMode as google.maps.TravelMode)
          } }
          callback={ (e: any) => {
            if (e.status === 'NOT_FOUND') {
              setErrorState({ error: true });
              setDirections(null);
              return;
            };
            let duration = 0;
            let legs = e?.routes[0].legs;
            if (legs) {
              for (let i = 0; i < legs.length; i++) {
                duration += legs[i].duration?.value || 0;
              }
            }
            setDuration(duration);
            setDirections(e)
          } }
        /> }
    </GoogleMap>
  }

  let leaveString = "";
  if (isLoaded && duration && selectedEvent) {
    let timeToLeave = getLeaveAt(new Date(selectedEvent!.when).getTime(), duration);
    if (typeof timeToLeave === "number") {
      leaveString = "Leave ASAP! You're running late!";
    }
    else {
      leaveString = `Leave at ${timeToLeave.toLocaleTimeString()}`;
    }
  }

  return isLoaded ? (
    <div className={ styles.container }>
      { selectedEvent && <>
        <div className={ styles.timeToLeave }>
          <div>
            <div>Your trip takes { duration && getMinutesFromDuration(duration) } minutes.</div>
            <div>{ leaveString }</div>
          </div>
          <div className={ styles.buttonContainer }>
            <ActionIcon onClick={ () => { setDirections(null); setTravelMode(google.maps.TravelMode.DRIVING); } } color={ "blue" } variant={ travelMode === google.maps.TravelMode.DRIVING ? "filled" : "hover" } style={ { height: "100%", padding: 2, margin: 2 } } size={ 40 }><Car size={ 40 } /></ActionIcon>
            <ActionIcon onClick={ () => { setDirections(null); setTravelMode(google.maps.TravelMode.TRANSIT); } } color={ "green" } variant={ travelMode === google.maps.TravelMode.TRANSIT ? "filled" : "hover" } style={ { height: "100%", padding: 2, margin: 2 } } size={ 40 }><Bus size={ 40 } /></ActionIcon>
          </div>
        </div>
        <GoogleMap
          mapContainerStyle={ containerStyle }
          center={ center }
          zoom={ 10 }
          onLoad={ onLoad }
          onUnmount={ onUnmount }
          options={ { streetViewControl: false, mapTypeControl: false } }
        >
          <DirectionsRenderer directions={ directions } />
        </GoogleMap>
      </> }
    </div>
  ) : (
    <></>
  );
};

export default GoogleMapWrapper;
