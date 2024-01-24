// Form.js
import React, { useState } from 'react';

import '../css/Form.css';

const Form = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [electricity, setElectricity] = useState('');
    const [tole, setTole] = useState('');
    const [location, setLocation] = useState({});
    const [generatedCode, setGeneratedCode] = useState('');

    const isDataFilled = () => {
        if (name && email && address && electricity && tole && location.latitude && location.longitude) {
            return true;
        }
        else {
            return false;
        }
    }

    const showPosition = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        resolve({
                            latitude: latitude,
                            longitude: longitude,
                        });

                        setLocation({
                            latitude: latitude,
                            longitude: longitude,
                        })
                    },
                    (error) => {
                        console.error("Error getting location:", error.message);
                        reject(error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by your browser");
                reject(new Error("Geolocation is not supported by your browser"));
            }
        });
    };
    const handleLocationAccess = async () => {
        await showPosition();
    }
    const handleSubmit = async () => {
        if (isDataFilled()) {
            try {


                const response = await fetch("https://housenumber.onrender.com/api/submitData", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        address,
                        location: location,
                        electricity,
                        tole
                    }),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setGeneratedCode(data.code);
            } catch (error) {
                console.error("Error submitting data:", error);
            }
        }
        else {
            alert("Fill all the data!!")
        }
    };
    return (
        <div className="form-container">
            <h2>Submit Your Information</h2>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Electricity Customer Number:</label>
            <input type="text" value={electricity} onChange={(e) => setElectricity(e.target.value)} />


            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="address">
                <label>Address:</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                <label>Tole:</label>
                <input type="text" value={tole} onChange={(e) => setTole(e.target.value)} />
            </div>
            <div className="buttons">
                <button className='locationButton' onClick={handleLocationAccess}>Location Access</button>
                <button onClick={handleSubmit}>Submit</button>
            </div>

            {location.latitude && (
                <div className="location-container">
                    <h3>Location Access Granted</h3>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>

                </div>
            )}

            {generatedCode && (
                <div className="code-container">
                    <p>Your temporary house number is: {generatedCode}</p>

                </div>
            )}
        </div>
    );
};

export default Form;
