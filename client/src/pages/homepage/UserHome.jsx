import { useEffect, useState } from "react";
import { fetchAllCountries } from "../../api/countryApi";
import ImageHeader from "../components/homepage/ImageHeader";
import CountryCount from "../components/homepage/CountryCount";
import { DraggableCardCon } from "../components/homepage/DraggableCardContainer";
import CountrySearch from "../components/homepage/CountrySearch";
import WebsiteIntro from "../components/homepage/WebsiteIntro";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/layout/Loader/Loader";

function UserHome() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  

  useEffect(() => {
    const getCountries = async () => {
      try {
        const data = await fetchAllCountries();
        setCountries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getCountries();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-h-screen w-full">
      <ImageHeader />
      <div className="p-6 bg-background min-h-screen">
        <div>
          <WebsiteIntro />
        </div>
        <div>
          <CountryCount />
        </div>
        <div>
          <CountrySearch />
        </div>
        <div className="hidden md:block">
          <div>
            <DraggableCardCon />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserHome;
