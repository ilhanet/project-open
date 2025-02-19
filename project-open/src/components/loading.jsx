import { Oval } from  'react-loader-spinner';
import { useEffect, useState } from "react";

export function Loading() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  });

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
