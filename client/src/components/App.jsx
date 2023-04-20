import React, { useState, useEffect } from "react";

import Header from "./Header";
import UpperBody from "./UpperBody";
import LowerBody from "./LowerBody";
import ReviewSection from "./ReviewSection";
import LocationSection from "./LocationSection";
import Footer from "./Footer";


import "./nl-components.css"; //cilent/src/nl-components.css

function App() {

  const [saveFav, setSaveFav] = useState(false);
  const [positions, setPositions] = useState([-37.857759, 175.679769]);
  const [signedIn, setSignedIn] = useState(false);
  const [lanData, setLanData] = useState([{}]);
  const [currData, setCurrData] = useState([{}]);
  const [currentLan, setCurrentLan] = useState('English (US)');
  const [currentCurrency, setCurrentCurrency] = useState('$ USD');
  const [siteUsers, setSiteUsers] = useState([{}])
  const [property, setProperty] = useState([{}])
  const [selectedProperty, setSelectedProperty] = useState({});
  const [superHost, setSuperHost] = useState(false);
  const [mainHeader, setMainHeader] = useState(true);
  
  

  useEffect(() =>{
    getUsers();
  }, [])

  const getUsers = async () =>{
    try {
      const res = await fetch ('http://localhost:5172/users');
      const text = await res.text();
      //console.log('Users', text);
      const data = JSON.parse(text);
      setSiteUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() =>{
    getProperty();
  }, [])

  const getProperty = async () =>{
    try {
      const res = await fetch ('http://localhost:5172/properties');
      const text = await res.text();
      //console.log('Properties', text);
      const data = JSON.parse(text);
      setProperty(data);
    } catch (err) {
      console.error(err);
    }
  }

  //console.log(property);
  
  const rating = property[0].stars;
  const numReviews = property[0].reviewsnum;
  const propertyName = property[0].propertyname;
  const propCity = property[0].city;
  const propState = property[0].state;
  const propCountry = property[0].country;
  const guest = property[0].guests;
  const hostid = property[0].hostid;
  const propBeds = property[0].beds;
  const propInfo = property[0].about;
  const locationInfo = property[0].locationinfo;
  const nightPrice = property[0].price;
  

  useEffect(() => {
    const superRating = property[0]?.stars;
    if(superRating >= 4.0){
      setSuperHost(true);
    }
  }, [property]);
  const superHosticon = 'https://cdn-icons-png.flaticon.com/512/26/26851.png';

  return (
    <div>
      {
        mainHeader
          ? <Header
              signedIn={signedIn}
              setSignedIn={setSignedIn}
              lanData={lanData}
              setLanData={setLanData}
              currData={currData}
              setCurrData={setCurrData}
              setCurrentLan={setCurrentLan}
              setCurrentCurrency={setCurrentCurrency}
              siteUsers={siteUsers}
              setMainHeader={setMainHeader}
            />
          : null
      }
      {/* Section Break */}
      <center><div style={{ backgroundColor: '#dadada', width: 'auto', height: '1px' }}></div></center>
      {/* Section Break */}
      <UpperBody
        saveFav={saveFav}
        setSaveFav={setSaveFav}
        signedIn={signedIn}
        setSignedIn={setSignedIn}
        positions={positions}
        setPositions={setPositions}
        numReviews={numReviews}
        rating={rating}
        siteUsers={siteUsers}
        propertyName={propertyName}
        propCity={propCity}
        propCountry={propCountry}
        propState={propState}
        superHost={superHost}
        superHosticon={superHosticon}
      />
      {/* Section Break */}

      {/* Section Break */}
      <LowerBody 
        numReviews={numReviews}
        rating={rating}
        propertyName={propertyName}
        guest={guest}
        propBeds={propBeds}
        superHost={superHost}
        siteUsers={siteUsers}
        propInfo={propInfo}
        locationInfo={locationInfo}
        nightPrice = {nightPrice}
      />
      <pre><br></br></pre>
      {/* Section Break */}
      <center><div style={{ backgroundColor: '#dadada', width: 'auto', height: '1px' }}></div></center>
      {/* Section Break */}
      <ReviewSection />
      {/* Section Break */}
      <center><div style={{ backgroundColor: '#dadada', width: 'auto', height: '1px' }}></div></center>
      {/* Section Break */}
      <LocationSection
        positions={positions}
        setPositions={setPositions}
      />
      {/* Section Break */}

      {/* Section Break */}
      <Footer
        currentLan={currentLan}
        currentCurrency={currentCurrency}
        lanData={lanData}
        currData={currData}
        setCurrentLan={setCurrentLan}
        setCurrentCurrency={setCurrentCurrency}
      />
    </div>
  );
};

export default App;