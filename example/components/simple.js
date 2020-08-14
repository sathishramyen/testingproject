// @flow

import React, { Component } from "react";
// import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "../../src";
import axios from "axios";

export default class SimpleExample extends Component {
  constructor() {
    super();
    this.state = {
      lat: 0,
      lng: 0,
      zoom: 17,
      points: [],
      udata: "",
      vdata: "",
      count: 10,
      clicked: false
    };
  }
  // getRandomPointInCircle() {
  //   const t = 2 * Math.PI * Math.random();
  //   const r = Math.sqrt(Math.random());
  //   const cx = r * Math.cos(t);
  //   const cy = r * Math.sin(t);
  //   const fill = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  //   return {cx, cy, fill, r:"0.02"};
  // }
  // addPoints = () => {
  //   const points = this.state.points.concat(
  //     new Array(1).fill().map(p => this.getRandomPointInCircle())
  //   );
  //   this.setState({points})
  // }
  handleClick = () => {
    debugger;
    const clicked = this.state.clicked
   
      this.setState({count: this.state.count - 1, clicked: false});
      this.locationload();
      // this.setState({ clicks: this.state.clicks - 1 });
      // console.log("clicks", clicks)
  }

  locationload() {
    var position;
    axios
      .get(
        "http://qrng.anu.edu.au/API/jsonI.php?length=2&type=uint8&size=1&time=1597296651514"
      )
      .then((response) => {
        let u_data = response.data.data[0];
        let v_data = response.data.data[1];
        // console.log("response.data", response.data.data);
        debugger;
        navigator.geolocation.getCurrentPosition(
          (position) => {
            var r = (0 + Math.random() * (4500 + 1 - 0)) / 111300, // = 5000 meters radius
              y0 = 9.891851,
              x0 = 78.138762,
              // below given co-ords are dynamic users curent location generater position
              // y0 = position.coords.latitude,
              // x0 = position.coords.longitude,
              // u = Math.random(),
              // v = Math.random(),

              // http://qrng.anu.edu.au/API/jsonI.php?length=2&type=uint8&size=1&time=1597296651514
              // above api will generate randokm numbers and javascript will change it float numbers to calculate with u and v
              // below u and v are random generated from above API it changed to float

              u = (100 * u_data) / 35000,
              v = (100 * v_data) / 35000,
              w = r * Math.sqrt(u),
              // t = 2 * Math.PI * v,
              t = 2 * Math.PI * Math.random(),
              x = w * Math.cos(t),
              y1 = w * Math.sin(t),
              x1 = x / Math.cos(y0); //y0 -> t makes long distance plots

              // t = 2 * Math.PI * Math.random();
              // r = Math.sqrt(Math.random());
              // x = r * Math.cos(t);
              // y = r * Math.sin(t);

            let lat = y0 + y1;
            let lng = x0 + x1;
            console.log("u", u);
            console.log("v", v);
            console.log("getCurrentPosition Success " + lat + "," + lng);
            this.setState({
              lat: lat,
              lng: lng,
            });
          },
          (error) => {
            this.props.displayError("Error dectecting your location");
            console.error(JSON.stringify(error));
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        this.setState({
          udata: u_data,
          vdata: v_data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    let bounds = this.refs.map.leafletElement.getBounds();

    // console.log(bounds);

    // const map = this.leafletMap.leafletElement;
    // const geocoder = L.Control.Geocoder.nominatim();
    // let marker;

    // map.on("click", e => {
    //   geocoder.reverse(
    //     e.latlng,
    //     map.options.crs.scale(map.getZoom()),
    //     results => {
    //       var r = results[0];
    //       if (r) {
    //         if (marker) {
    //           marker
    //             .setLatLng(r.center)
    //             .setPopupContent(r.html || r.name)
    //             .openPopup();
    //         } else {
    //           marker = L.marker(r.center)
    //             .bindPopup(r.name)
    //             .addTo(map)
    //             .openPopup();
    //         }
    //       }
    //     }
    //   );
    // });
  }

  componentDidMount() {
    // this.locationload();
    // this.handleClick();
  }
  render() {
    const location = [this.state.lat, this.state.lng];
    const { u_data, v_data, clicks } = this.state;
    // const {points} = this.state;
    let urlJsonObj =
      "https://maps.google.com/maps?q=" +
      this.state.lat.toString() +
      "," +
      this.state.lng.toString() +
      "";
    return (
      <div>
        <div>
          <Map
            useRef="map"
            // ref={m => {
            //   this.leafletMap = m;
            // }}
            center={location}
            zoom={this.state.zoom}
            bounceAtZoomLimits={true}
            maxBoundsViscosity={0.95}
            maxBounds={[
              [-180, -90],
              [180, 90],
            ]}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={location}>
              <Popup>
                {this.state.lat},{this.state.lng}
              </Popup>
            </Marker>
          </Map>
        </div>
        <div>
          <a href={urlJsonObj} style={{ display: (this.state.lat && this.state.lng) === 0 ? "none" : "block"}} target="_blank">See on google maps</a>
        </div>
      <button onClick={this.handleClick} disabled={this.state.count < 1}>{this.state.count < 1 ? "" : this.state.count} click to load random location</button>
      </div>
    );
  }
}

// @flow

// import React, { Component } from 'react'
// import { Map, TileLayer, Marker, Popup } from '../../src'

// export default class SimpleExample extends Component {
//   constructor() {
//     super()
//     this.state = {
//         lat: 0,
//         lng: 0,
//         zoom:17,
//         points: []
//     }
//   }
//   // getRandomPointInCircle() {
//   //   const t = 2 * Math.PI * Math.random();
//   //   const r = Math.sqrt(Math.random());
//   //   const cx = r * Math.cos(t);
//   //   const cy = r * Math.sin(t);
//   //   const fill = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
//   //   return {cx, cy, fill, r:"0.02"};
//   // }
//   // addPoints = () => {
//   //   const points = this.state.points.concat(
//   //     new Array(1).fill().map(p => this.getRandomPointInCircle())
//   //   );
//   //   this.setState({points})
//   // }
//   componentDidMount() {
//     var position;
//     let bounds =  this.refs.map.leafletElement.getBounds();
//     console.log(bounds);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         let lat = position.coords.latitude + ((Math.random() * 1) - 0.25) * 0.001;
//         let lng = position.coords.longitude + ((Math.random() * 1) - 0.5) * 0.011;
//         console.log("getCurrentPosition Success " + lat + "," + lng);
//         this.setState({
//             lat: lat,
//             lng: lng
//         })
//       },
//       (error) => {
//         this.props.displayError("Error dectecting your location");
//         console.error(JSON.stringify(error))
//       },
//       {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
//     )

//   }
//   render() {
//     const location = [this.state.lat, this.state.lng];
//     const {points} = this.state;
//     return (
//       <div>
//       <div>
//          <Map
//          ref='map'
//          center={location}
//          zoom={this.state.zoom}
//          bounceAtZoomLimits={true}
//          maxBoundsViscosity={0.95}
//          maxBounds={[[-180, -90], [180, 90]]}
//          >
//          <TileLayer
//           attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={location}>
//            <Popup>
//            my current location
//            </Popup>
//          </Marker>

//          </Map>
//       </div>
//       {/* <div>
//       <button onClick={this.addPoints}>Add 20 points</button><br/>
//       <svg style={{overflow:'visible', zIndex:'999999'}} height="200px" viewBox="-1 -1 2 2">
//           <rect width="2" height="2" x="-1" y="-1" fill="#efefef" />
//           <circle cx={0} cy={0}r={1} fill="#ffffff" />
//           {points.map((p,index)=>(
//             <circle
//               key={`${p.x}-${p.y}-${index}`}
//               {...p}
//             />
//           ))}
//         </svg>
//       </div> */}
//       </div>
//     )
//   }
// }
