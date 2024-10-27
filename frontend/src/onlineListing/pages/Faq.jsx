import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import Footer from '../components/Footer';


const Faq = () => {
      return (
            <div>
                  <Navbar />
                  <Searchbar />


                  <div className="flex justify-center items-center min-h-screen  px-4 text-black py-40">
                        <div className="bg-white p-8 max-w-full text-left">
                              <h1 className="text-3xl font-bold mb-10 text-center ">Frequently Asked Questions</h1>


                              <h2 className="text-xl font-bold mb-4">How to Reserve Order</h2>
                              <ol className="list-decimal pl-6 mb-8">
                                    <li>Add item to your cart.</li>
                                    <li>Click on the Cart icon in the upper right corner to view your cart.</li>
                                    <li>Click on the Checkout button.</li>
                                    <li>Enter Customer Details.</li>
                                    <li>Click on Confirm Reservation Button.</li>
                              </ol>


                              <h2 className="text-xl font-bold mb-4">Payment method options</h2>
                              <ol className="list-decimal pl-6 mb-8">
                                    <li><span className="font-bold">Cash</span> – in-store transactions.</li>
                                    <li><span className="font-bold">Credit/Debit Cards</span> – Visa, Mastercard, American Express, and other major card networks.</li>
                                    <li><span className="font-bold">Bank Transfers</span> – Direct transfers via online banking apps like BPI, BDO, Metrobank, etc.</li>
                                    <li><span className="font-bold">e-Wallets</span> – GCash, PayMaya, and GrabPay are popular for online and offline transactions.</li>
                              </ol>


                              <h2 className="text-xl font-bold mb-4">How do I claim my reserved order?</h2>
                              <ol className="list-decimal pl-6 mb-8">
                                    <li>Present this receipt at our store.</li>
                                    <li>Bring a valid ID for verification.</li>
                                    <li>Proceed to payment.</li>
                                    <li>Ensure you collect your items before the expiry date.</li>
                              </ol>


                              <h2 className="text-xl font-bold mb-4">What is the policy on item warranty?</h2>
                              <p className="mb-8">
                                    For complete details, please refer to the
                                    <a href="#" className="text-blue-500"> Product Warranty</a>.
                              </p>


                              <h2 className="text-xl font-bold mb-4">How to return an item?</h2>
                              <p>
                                    For complete details, please refer to the
                                    <a href="#" className="text-blue-500"> Return and Exchange</a>.
                              </p>
                        </div>
                  </div>


                  <Footer />
            </div>
      );
};


export default Faq;