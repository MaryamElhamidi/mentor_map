import {
  Directions,
  getMapData,
  Marker,
  show3dMap,
  Space,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";
import "./styles.css";
import mentor1 from './mentor_1.png';
import mentor2 from './mentor_2.png';
import mentor3 from './mentor_3.png';
import mentor4 from './mentor_4.png';
import mentor5 from './mentor_5.png';


interface Asset {
  name: string;
  image: string;
  color: string;
  step: number;
  originSpace: Space;
  destinationSpace?: Space;
  directions?: Directions;
  marker: Marker | undefined;
}

function createGuardMarker(
  color: string = "#ffffff",
  label: string = "Contractor",
  image: string = ""
) {
  const imageUrl = image || "https://path-to-your-default-image.png"; // Fallback image URL
  const html = `
  <div class="" style="">
    <div class="" style="border:3px solid ${
      image === "" ? "#ffffff" : color
    };background-color:${
    image === "" ? color : "white"
  };width:44px;height:44px;border-radius:32px;overflow:hidden;box-shadow: 0px 3px 15px -3px rgba(0,0,0,0.3);">
    ${
      image === ""
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 44 44" fill="white"><path d="M3.78307 2.82598L12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598Z"></path></svg>`
        : `<img src="${imageUrl}" style="width:44px;height:44px;border-radius:22px;object-fit:cover" onerror="this.onerror=null;this.src='https://path-to-your-fallback-image.png';">`
    }
    </div>
    <div style="text-align:center;">${label}</div>
  </div>`;
  return html;
}

async function init() {
  // See Trial API key Terms and Conditions
  // https://developer.mappedin.com/web/v6/trial-keys-and-maps/
  const mapData = await getMapData({
    key: "mik_Qar1NBX1qFjtljLDI52a60753",
    secret: "mis_CXFS9WnkQkzQmy9GCt4ucn2D68zNRgVa2aiJj5hEIFM8aa40fee",
    mapId: "66ce20fdf42a3e000b1b0545",
    viewId: "JN5Y", // Add your viewId here
  });

  //Display the default map in the mappedin-map div with outdoor view styling.
  const mapView = await show3dMap(
    document.getElementById("mappedin-map") as HTMLDivElement,
    mapData,
    {
      outdoorView: {
        style: 'https://tiles-cdn.mappedin.com/styles/midnightblue/style.json',
      },
    }
  );

  const assets: Asset[] = [];

  mapView.Labels.all();
  mapView.Camera.set({ bearing: -21, pitch: 45 });

  function getRandomSpace() {
    const spaces = mapData
      .getByType("space")
      .filter((s) => s.floor.id === mapView.currentFloor.id);
    return spaces[Math.floor(Math.random() * spaces.length)];
  }

  function addAsset(name: string, image: string, color: string = "#0279FF") {
    const originSpace = getRandomSpace();
    const marker = mapView.Markers.add(
      originSpace,
      createGuardMarker(color, name, image),
      { rank: "always-visible" }
    );

    assets.push({
      name: name,
      image: image,
      color: color,
      originSpace: originSpace,
      marker: marker,
      step: 0,
    });
  }

  function updateAsset(a: Asset, duration: number) {
    if (!a.directions || a.directions.distance == 0) {
      a.destinationSpace = getRandomSpace();
      a.directions = mapView.getDirections(a.originSpace, a.destinationSpace);
      if (a.directions && a.directions.distance == 0) {
        return;
      }
    }

    const coordinate = a.directions?.coordinates[a.step];
    if (!coordinate) {
      return;
    }

    if (a.marker) {
      mapView.Markers.animateTo(a.marker, coordinate, {
        duration: duration,
        easing: "linear",
      });
    }

    if (a.directions && a.step >= a.directions.coordinates.length - 2) {
      const c1 = a.directions.coordinates[a.directions.coordinates.length - 1];
      const s2 = getRandomSpace();
      let newDirections = mapView.getDirections(c1, s2);
      if (!newDirections || newDirections.coordinates.length === 0) {
        return;
      }
      a.directions = newDirections;
      a.step = 0;
    } else {
      a.step += 1;
    }
  }

  addAsset("Mentor 1", mentor1, "#3DA93B");
  addAsset("Mentor 2", mentor2, "#F6C644");
  addAsset("Mentor 3", mentor3, "#FA7921");
  addAsset("Mentor 4", mentor4, "#393271");
  addAsset("Mentor 5", mentor5, "#0279FF");
  

  function updatePositions() {
    assets.forEach((a) => {
      if (Math.random() < 0.5) {
        updateAsset(a, Math.random() * 3000 + 1000);
      }
    });
    setTimeout(updatePositions, 4000);
  }

  setTimeout(() => {
    updatePositions();
  }, 1000);
}

init();
