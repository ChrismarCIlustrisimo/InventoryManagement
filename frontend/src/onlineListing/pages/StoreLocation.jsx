import Navbar from '../components/Navbar';
import Searchbar from "../components/Searchbar";
import RawIrig from "../assets/RawIrig.jpeg";
import GMapsIrig from "../assets/GmapsIrig.jpeg";
import GMapLogo from "../assets/GmapLogo.jpeg";
import WazeLogo from "../assets/WazeLogo.jpeg";
import Footer from "../components/Footer";

const StoreLocation = () => {
      return (
            <div>

                  <Navbar />
                  <Searchbar />


                  <div className="mt-32 text-black text-center">
                        <h1 className="text-3xl font-bold">Store Location</h1>
                        <p className="mt-4 ">
                              Our knowledgeable staff is always on hand to assist you with any
                              questions you may have and help you find the perfect solution.
                        </p>
                  </div>


                  <div className="max-w-4xl mx-auto p-6 mt-8 grid grid-cols-1 md:grid-cols-2 ">


                        <div className="flex flex-col space-y-6 w-64">

                              <div className="flex justify-center items-center space-x-8">
                                    <img
                                          src={GMapLogo}
                                          alt="Google Maps"
                                          className="w-8 h-8"
                                    />
                                    <img
                                          src={WazeLogo}
                                          alt="Waze"
                                          className="w-8 h-8"
                                    />
                              </div>

                              <div className="flex items-center justify-between text-black">
                                    <h1 className="text-xl font-bold">iRIG Computers</h1>
                              </div>


                              <div className="text-lg text-black bg-white rounded-lg shadow px-3 py-4">
                                    <p>23 General Tinio, Morning Breeze Subdivision,</p>
                                    <p>Caloocan, 1401 Metro Manila</p>
                              </div>


                              <div className="text-lg text-black bg-white rounded-lg shadow px-3 py-4">
                                    <div className="font-medium text-red-500">Store Hours:</div>


                                    <div className="flex justify-between ">
                                          <p>Mon - Sat:</p>
                                          <p className="w-28 text-left">9AM - 6PM</p>
                                    </div>


                                    <div className="flex justify-between ">
                                          <p>Sunday:</p>
                                          <p className="w-28 text-left">Closed</p>
                                    </div>
                              </div>




                              <div className="text-lg text-black bg-white rounded-lg shadow px-3 py-4">
                                    <div className="font-medium text-red-500">Contact:</div>
                                    <p>0923-444-1030</p>
                                    <p>(02) 83646039</p>
                              </div>
                        </div>


                        <div className="grid grid-cols-1 gap-6">

                              <div className="rounded-lg overflow-hidden shadow-lg">
                                    <img
                                          src={RawIrig}
                                          alt="Storefront"
                                          className="w-full h-full object-cover"
                                    />
                              </div>


                              <div className="rounded-lg overflow-hidden shadow-lg ">
                                    <img
                                          src={GMapsIrig}
                                          alt="Map"
                                          className="w-full h-full object-cover"
                                    />
                              </div>
                        </div>

                  </div>

                  <Footer />
            </div>
      );
};

export default StoreLocation;