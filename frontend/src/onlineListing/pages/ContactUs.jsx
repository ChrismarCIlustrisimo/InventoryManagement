import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import Footer from '../components/Footer';


function ContactUs() {
      return (
            <div>
                  <Navbar />
                  <Searchbar />


                  <div className="mt-32 text-black text-center">
                        <h1 className="text-3xl font-bold mb-10">Contact Us</h1>
                  </div>


                  <div className="max-w-xl mx-auto p-8 bg-white shadow rounded-md text-black mb-10">
                        <div className="mb-4">
                              <div className="flex">
                                    <h2 className="text-sm font-semibold w-1/3">TELEPHONE NUMBER</h2>
                                    <p className="w-2/3">(02) 83646039</p>
                              </div>
                        </div>
                        <div className="mb-4">
                              <div className="flex">
                                    <h2 className="text-sm font-semibold w-1/3">PHONE NUMBER</h2>
                                    <p className="w-2/3">0923-444-1030</p>
                              </div>
                        </div>
                        <div className="mb-4">
                              <div className="flex">
                                    <h2 className="text-sm font-semibold w-1/3">EMAIL</h2>
                                    <p className="w-2/3">irigcomputers@gmail.com</p>
                              </div>
                        </div>
                        <div className="mb-4">
                              <div className="flex">
                                    <h2 className="text-sm font-semibold w-1/3">FB MESSENGER</h2>
                                    <a href="https://www.facebook.com/irigcomputers" className="text-blue-500 w-2/3">
                                          https://www.facebook.com/irigcomputers
                                    </a>
                              </div>
                        </div>
                        <hr />
                        <br />



                        <div className="mb-6 ml-24">
                              <h2 className="text-sm font-semibold">Our Business Address:</h2>
                              <p>iRIG Computers</p>
                              <p>23 General Tinio, Morning Breeze Subdivision,</p>
                              <p>Caloocan, 1401 Metro Manila</p>
                        </div>





                  </div>


                  <div className="text-s text-black text-center font-bold mb-16">
                        Please DO NOT send emails and messages that are off-topic as they may not be replied to.
                  </div>


                  <Footer />
            </div>
      );
}


export default ContactUs;


