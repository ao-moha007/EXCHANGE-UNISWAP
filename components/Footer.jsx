import React from "react";

const Footer = () => {
  return (
  <div className="footer"
    style={{ backgroundImage: "url('assets/img/footer-bg.png')" }}>
    <div className="container">
      <div className="row">
        <div
          className="col-12 wow fadeInUp"
          data-wow-duration="0.3s"
          data-wow-delay="0.2s"
        >
          <div className="top-footer">
            <div className="logo">
              <img src="assets/img/logo.png" alt="" />
            </div>
            <a href="/" className="button-1">
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    <div className="row justify-content-between">
      <div className="col-lg col-md-6 wow fadeInUp"
          data-wow-duration="0.3s"
          data-wow-delay="0.3s" >
            <div className="footer-box">
              <h4 className="lasthead">Company</h4>
              <ul className="footer-link">
                {["About Us","Contact Us","Blog","Affiliate"].
                map(
                  (item,index) => (
                    <li key={index}>
                      <a href="#">{item}</a>
                    </li>
                  )
                )}
                
              </ul>
            </div>
            <div className="footer-box">
              <h4 className="lasthead">Support</h4>
              <ul className="footer-link">
                {["FAQ","Contact Time","How its work","Details"].
                map(
                  (item,index) => (
                    <li key={index}>
                      <a href="#">{item}</a>
                    </li>
                  )
                )}
                
              </ul>
            </div>
            <div className="footer-box">
              <h4 className="lasthead">Policy</h4>
              <ul className="footer-link">
                {["Term Of Use",
                "Privacy Policy",
                "Refunds Policy",
                "Money Type"].
                map(
                  (item,index) => (
                    <li key={index}>
                      <a href="#">{item}</a>
                    </li>
                  )
                )}
                
              </ul>
            </div>
            <div className="footer-box">
              <h4 className="lasthead">Newsletter</h4>
              <form action="#">
                <div className="form-group">
                  <input type="email" placeholder="Enter email address"/>
                  <button type="submit" className="button-1">
                    Join Now
                  </button>
                </div>
              </form>
              <div className="social-style">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-pinterest-p"></i>
                </a>
                <a href="#">
                  <i className="fab fa-google-plus-g"></i>
                </a>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
    </div>
    <div className="row">
      <div className="col-12 tet-center wow fadeInUp"
          data-wow-duration="0.4s"
          data-wow-delay="0.4s"
          >
            <div className="footer-bottom">
              <p className="text">
                Copyright &copy;  
                <a
                href="#">   aouichmed </a>
                <a href="#">2025</a>
              </p>
            </div>
          </div>
    </div>
    </div>

  </div>);


};

export default Footer;
