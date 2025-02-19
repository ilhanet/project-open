import { Oval } from  'react-loader-spinner';
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

export function Loading2() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true); // Set loading to true on location change
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Clear the timer when the component unmounts or location changes
    return () => clearTimeout(timer);
  }, [location]);

  return (
      loading ? (
        <div className="loadingPage bg-1">
          <Oval
            height={50}
            width={50}
            color="#395FEA"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#d4d4d4"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ):("")
  );
}
