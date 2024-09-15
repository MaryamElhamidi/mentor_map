import {
  getMapData,
  show3dMap,
  Space,
  Marker,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";
import "./styles.css";
import mentor1 from './mentor_1.png';
import mentor2 from './mentor_2.png';
import mentor3 from './mentor_3.png';
import mentor4 from './mentor_4.png';
import mentor5 from './mentor_5.png';
import hacker1 from './hacker_1.png';
import hacker2 from './hacker_2.png';
import hacker3 from './hacker_3.png';
import hacker4 from './hacker_4.png';

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
  image: string = "",
  square: boolean = false
) {
  const imageUrl = image || hacker1; // Default or fallback image URL
  const borderRadius = square ? "0px" : "22px"; // Square for hackers, rounded for mentors
  const styleForHackers = square ? `
    <div style="display:flex;align-items:center;padding:4px;background-color:#f0f0f0;border-radius:4px;box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
      <div style="width:30px;height:30px;border-radius:15px;overflow:hidden;margin-right:8px;">
        <img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover" onerror="this.onerror=null;this.src='https://path-to-your-fallback-image.png';">
      </div>
      <div style="flex-grow:1;">${label}</div>
    </div>
  ` : `
    <div class="" style="border:3px solid ${color};background-color:${color};width:44px;height:44px;border-radius:${borderRadius};overflow:hidden;box-shadow: 0px 3px 15px -3px rgba(0,0,0,0.3);">
      <img src="${imageUrl}" style="width:44px;height:44px;border-radius:${borderRadius};object-fit:cover" onerror="this.onerror=null;this.src='https://path-to-your-fallback-image.png';">
    </div>
    <div style="text-align:center;">${label}</div>
  `;

  return `<div>${styleForHackers}</div>`;
}
async function init() {
  const mapData = await getMapData({
    key: "mik_Qar1NBX1qFjtljLDI52a60753",
    secret: "mis_CXFS9WnkQkzQmy9GCt4ucn2D68zNRgVa2aiJj5hEIFM8aa40fee",
    mapId: "66ce20fdf42a3e000b1b0545",
    viewId: "JN5Y",
  });

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

  function addHackathonSaying(saying: string, image: string, color: string = "#FF6347") {
    const space = getRandomSpace();
    mapView.Markers.add(
      space,
      createGuardMarker(color, saying, image, true),
      { rank: "always-visible" }
    );
  }

  addAsset("Mentor 1", mentor1, "#3DA93B");
  addAsset("Mentor 2", mentor2, "#F6C644");
  addAsset("Mentor 3", mentor3, "#FA7921");
  addAsset("Mentor 4", mentor4, "#393271");
  addAsset("Mentor 5", mentor5, "#0279FF");

  // Initialize hackathon sayings across the map
  addHackathonSaying("I'm so sleepy", hacker1, "#FF6347");
  addHackathonSaying("Running upon many errors", hacker2, "#FF6347");
  addHackathonSaying("At the workshop", hacker3, "#FF6347");
  addHackathonSaying("Networking right now!!", hacker4, "#FF6347");

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