import React from "react";
import { FaRegStar } from "react-icons/fa";
const Testomonial = () => {
  return (
    <section className="testimonial">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 text-center wow fadeInUp"
          data-wow-duration="0.3s"
          data-wow-delay="0.3s">
            <div className="section-head">
              <h4 className="lasthead">Testimonials</h4>
              <h2 className="title">Don't just take our word for it!</h2>
              <p className="text">
                Don't be afraid!! you have nothing to loose, just go ahaid !
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 wow fadeInUp"
                data-wow-duration="0.3s"
                data-wow-delay="0.5s">
                  <div className="about-testimonial">
                    <img src="assets/img/world-map.png" alt=""/>
                    
                    <div className="client one">
                      <div className="img one" style={{backgroundImage: "url('assets/img/testi1.png')"}}>
                        <div id="myPopover"
                        className="popover popover-default mypopover">
                          <div className="client-review">
                            <div className="stars">
                              {[1,2,3,4,5].map((item,index)=>(
                                <i className="fas ">
                                  <FaRegStar />
                                </i>
                              ))}
                              
                            </div>
                            <p className="bottom-text">
                              Try and try and try again. no matter what, you will succeed !!
                            </p>
                            <div className="client-info">
                              <h4 className="name">Flora Oliver</h4>
                              <p className="position">CEO & Founder</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="client two">
                      <div className="img one" style={{backgroundImage: "url('assets/img/testi2.png')"}}>
                        <div id="myPopover2"
                        className="popover popover-default mypopover">
                          <div className="client-review">
                            <div className="stars">
                              {[1,2,3,4,5].map((item,index)=>(
                                <i className="fas ">
                                  <FaRegStar />
                                </i>
                              ))}
                              
                            </div>
                            <p className="bottom-text">
                              Try and try and try again. no matter what, you will succeed !!
                            </p>
                            <div className="client-info">
                              <h4 className="name">Ross Geller</h4>
                              <p className="position"></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="client three">
                      <div className="img one" style={{backgroundImage: "url('assets/img/testi3.png')"}}>
                        <div id="myPopover3"
                        className="popover popover-default mypopover">
                          <div className="client-review">
                            <div className="stars">
                              {[1,2,3,4,5].map((item,index)=>(
                                <i className="fas ">
                                  <FaRegStar />
                                </i>
                              ))}
                              
                            </div>
                            <p className="bottom-text">
                              Try and try and try again. no matter what, you will succeed !!
                            </p>
                            <div className="client-info">
                              <h4 className="name">Monica Geller</h4>
                              <p className="position"></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="client four">
                      <div className="img one" style={{backgroundImage: "url('assets/img/testi4.png')"}}>
                        <div id="myPopover4"
                        className="popover popover-default mypopover">
                          <div className="client-review">
                            <div className="stars">
                              {[1,2,3,4,5].map((item,index)=>(
                                <i className="fas ">
                                  <FaRegStar />
                                </i>
                              ))}
                              
                            </div>
                            <p className="bottom-text">
                              Try and try and try again. no matter what, you will succeed !!
                            </p>
                            <div className="client-info">
                              <h4 className="name">Mathew Perry</h4>
                              <p className="position"></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="client five">
                      <div className="img one" style={{backgroundImage: "url('assets/img/testi5.png')"}}>
                        <div id="myPopover5"
                        className="popover popover-default mypopover">
                          <div className="client-review">
                            <div className="stars">
                              {[1,2,3,4,5].map((item,index)=>(
                                <i className="fas ">
                                  <FaRegStar />
                                </i>
                              ))}
                              
                            </div>
                            <p className="bottom-text">
                              Try and try and try again. no matter what, you will succeed !!
                            </p>
                            <div className="client-info">
                              <h4 className="name">Jennifer Anniston </h4>
                              <p className="position"></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="client six">
                      <div className="img one" style={{backgroundImage: "url('assets/img/testi6.png')"}}>
                        <div id="myPopover6"
                        className="popover popover-default mypopover">
                          <div className="client-review">
                            <div className="stars">
                              {[1,2,3,4,5].map((item,index)=>(
                                <i className="fas ">
                                  <FaRegStar />
                                </i>
                              ))}
                              
                            </div>
                            <p className="bottom-text">
                              Try and try and try again. no matter what, you will succeed !!
                            </p>
                            <div className="client-info">
                              <h4 className="name">Bruno Mars</h4>
                              <p className="position"></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  
                  </div>
                </div>
        </div>
      </div>
    </section>
  );
};

export default Testomonial;
