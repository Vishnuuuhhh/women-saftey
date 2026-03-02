import { useState, useRef } from "react";

function SOSButton() {

  const [error, setError] = useState("");
  const [holding, setHolding] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [tracking, setTracking] = useState(false);

  const intervalRef = useRef(null);
  const trackingRef = useRef(null);


  const startHold = () => {

    if (sending || tracking || cooldown) return;

    setHolding(true);
    setCountdown(2);

    intervalRef.current = setInterval(()=>{

      setCountdown(prev=>{

        if(prev<=1){
          clearInterval(intervalRef.current);
          triggerSOS();
          return 0;
        }

        return prev-1;

      });

    },1000);

  };


  const cancelHold = () => {

    clearInterval(intervalRef.current);
    setHolding(false);
    setCountdown(2);

  };


  const startLiveTracking = () => {

    setTracking(true);

    trackingRef.current = setInterval(async ()=>{

      const token = localStorage.getItem("token");

      navigator.geolocation.getCurrentPosition(async(position)=>{

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const mapsLink =
          `https://maps.google.com/?q=${lat},${lng}`;

        try{

          await fetch(
            `${import.meta.env.VITE_API_URL}/api/sos/update`,
            {
              method:"PUT",
              headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
              },
              body:JSON.stringify({
                latitude:lat,
                longitude:lng,
                mapsLink
              })
            }
          );

        }catch{}

      });

    },30000);

  };


  const stopSOS = async ()=>{

    clearInterval(trackingRef.current);
    setTracking(false);

    const token = localStorage.getItem("token");

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/sos/stop`,
      {
        method:"PUT",
        headers:{
          "Authorization":`Bearer ${token}`
        }
      }
    );

    alert("SOS stopped");

  };


  const triggerSOS = ()=>{

    if(cooldown){
      setError("Wait 30 seconds");
      return;
    }

    setHolding(false);
    setSending(true);

    const token = localStorage.getItem("token");

    navigator.geolocation.getCurrentPosition(async(position)=>{

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const mapsLink =
        `https://maps.google.com/?q=${lat},${lng}`;

      try{

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/sos`,
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json",
              "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
              latitude:lat,
              longitude:lng,
              mapsLink,
              time:new Date().toISOString()
            })
          }
        );

        if(res.ok){

          alert("SOS activated");

          setCooldown(true);

          setTimeout(()=>{
            setCooldown(false);
          },30000);

          startLiveTracking();

        }else{

          setError("SOS failed");

        }

      }catch{

        setError("Network error");

      }

      setSending(false);

    });

  };


  return(

    <div className="card">

      {!tracking &&

        <button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          className="sos-button"
          disabled={sending||cooldown}
        >

          {sending
            ?"Sending..."
            :cooldown
            ?"Wait..."
            :"HOLD TO SOS"}

        </button>

      }

      {tracking &&
        <button
          onClick={stopSOS}
          className="sos-button"
          style={{background:"gray"}}
        >
          STOP SOS
        </button>
      }

      {holding &&
        <p>Activating in {countdown}</p>
      }

      {tracking &&
        <p style={{color:"red"}}>
          Live tracking active
        </p>
      }

      {error &&
        <p style={{color:"red"}}>
          {error}
        </p>
      }

    </div>

  );

}

export default SOSButton;
