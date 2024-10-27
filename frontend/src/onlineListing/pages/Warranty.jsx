import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import Footer from "../components/Footer";


const Warranty = () => {
      return (
            <div>
                  <Navbar />
                  <Searchbar />


                  <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
                        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
                              <h1 className="text-2xl font-bold mb-4">Product Warranty</h1>
                              <p className="mb-4">
                                    All products purchased from iRIG Computers are covered by a 7-day full
                                    replacement warranty for items that arrive with factory defects. You may
                                    bring the defective item(s) to our store for replacement. Please ensure that
                                    the item is in its original packaging, with all included accessories, and
                                    accompanied by the original Sales Invoice. Items not returned in their
                                    original condition may not qualify for a replacement.
                              </p>
                              <p className="mb-4">
                                    For further inquiries, feel free to email us at irigcomputers@gmail.com or send us a message on our Facebook page at
                              </p>
                              <a href="https://www.facebook.com/irigcomputers" className="text-blue-500">
                                    https://www.facebook.com/irigcomputers
                              </a>
                        </div>
                  </div>
                  <Footer />
            </div>
      );
};


export default Warranty;


