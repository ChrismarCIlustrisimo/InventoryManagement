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
                <p className="mt-4">
                    Our knowledgeable staff is always on hand to assist you with any
                    questions you may have and help you find the perfect solution.
                </p>
            </div>

            <div className="max-w-4xl mx-auto p-6 mt-8 grid grid-cols-1 md:grid-cols-2">
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
                    {/* Storefront Image */}
                    <a
                        href="https://www.google.com/maps/uv?pb=!1s0x3397b682e6ff675d%3A0xc373eb96f28ced82!3m1!7e115!4s%2Fmaps%2Fplace%2F23%2BGeneral%2BTinio%2C%2BMorning%2BBreeze%2BSubdivision%2C%2BCaloocan%2C%2B1401%2BMetro%2BManila%2BIrig%2BComputers%2F%4014.6596121%2C120.9901217%2C3a%2C75y%2C260.8h%2C90t%2Fdata%3D*213m4*211e1*213m2*211sRlmAJq2tW2U19gMEdd720Q*212e0*214m2*213m1*211s0x3397b682e6ff675d%3A0xc373eb96f28ced82%3Fsa%3DX%26ved%3D2ahUKEwi7goSNreGJAxXsna8BHbjqMisQpx96BAg6EAA!5s23%20General%20Tinio%2C%20Morning%20Breeze%2BSubdivision%2C%2BCaloocan%2C%201401%20Metro%20Manila%2BIrig%20Computers%20-%20Google%20Search!15sCgIgAQ&imagekey=!1e2!2sRlmAJq2tW2U19gMEdd720Q&cr=le_a7&hl=en&ved=1t%3A206134&ictx=111"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-110"
                    >
                        <img
                            src={RawIrig}
                            alt="Storefront"
                            className="w-full h-full object-cover"
                        />
                    </a>

                    {/* Map Image */}
                    <a
                        href="https://www.google.com/maps/place/iRIG+Computers/@14.6596046,120.9874991,17z/data=!3m1!4b1!4m6!3m5!1s0x3397b682e6ff675d:0xc373eb96f28ced82!8m2!3d14.6596046!4d120.990074!16s%2Fg%2F1jmd0mv4j?entry=ttu&g_ep=EgoyMDI0MTExMy4xIKXMDSoASAFQAw%3D%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-110"
                    >
                        <img
                            src={GMapsIrig}
                            alt="Map"
                            className="w-full h-full object-cover"
                        />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StoreLocation;
