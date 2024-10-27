import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import Footer from '../components/Footer';


function ReturnPolicy() {
      return (
            <div>
                  <Navbar />
                  <Searchbar />


                  <div className="mt-32 text-black text-center mb-10">
                        <h1 className="text-3xl font-bold">Return Policy</h1>
                  </div>


                  <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-md text-black mb-20">
                        <ol className="list-decimal list-inside space-y-4">
                              <li>
                                    Customers must report any factory defects within seven (7) days of receiving the item.
                                    To do so, please email <a href="mailto:irigcomputers@gmail.com" target="_blank" className="text-blue-500">irigcomputers@gmail.com</a>,
                                    and an iRIG Computers representative will provide further instructions. Alternatively, you may visit our store.
                              </li>
                              <li>
                                    Only items confirmed to be defective by iRIG Computers staff are eligible for return or exchange.
                                    Returns or exchanges due to a change of mind are not permitted.
                              </li>
                              <li>
                                    The item must be returned in its original condition, including all packaging, manuals, accessories,
                                    and any other included items, all of which must be in pristine condition.
                                    The original Sales Invoice must also be provided.
                              </li>
                              <li>
                                    Defective items may be returned through our store.
                              </li>
                        </ol>


                        <div className="mt-6">
                              For further inquiries, feel free to email us at <a href="mailto:irigcomputers@gmail.com" target="_blank" className="text-blue-500">irigcomputers@gmail.com</a>
                              or send us a message on our Facebook page at
                              <a href="https://www.facebook.com/irigcomputers" target="_blank" className="text-blue-500 "> https://www.facebook.com/irigcomputers</a>.
                        </div>
                  </div>


                  <Footer />
            </div>
      );
}


export default ReturnPolicy;
