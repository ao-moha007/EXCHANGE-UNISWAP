import React,{useEffect,useState} from "react";

//INTERNAL IMPORT
import {shortenAddress} from "../utils/index";

const Token = (
  {
  notifyError,
  notifySuccess,
  setOpenToken,
  LOAD_TOKEN,
  setToken_1,
  setToken_2,
  token_1,
  token_2, }
          
) => {
  //STATE VARIABLE
  const [searchToken, setSearchToken] = useState();
  const [displayToken, setDisplayToken] = useState();

  //TOKEN DATA
  useEffect(()=>{
    const loadToken = async ()=> {
      const token = await LOAD_TOKEN(searchToken);

      if(token == undefined){
        notifyError("Token address is missing");
      }else{
        setDisplayToken(token);
      }
    };
    loadToken();

  },[searchToken]);

  const selectToken = ()=>{
    if(token_1 == undefined){
      setToken_1(displayToken);
      setOpenToken(false);
    } else {
      setToken_2(displayToken);
      setOpenToken(false);
    }
  }
  return (
    <div className="banner">
      <div className="hero-area">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-4 col-lg-6 wow new_width">
              <div className="exchange">
                <h5 className="ex-head">Cryptocurrency Token</h5>

                <div className="exchange-box">
                  <div className="selector">
                    <p className="text">
                      Search token address
                    </p>
                    <div className="icon">
                      <span>{displayToken?.symbol}</span>
                    </div>
                  </div>

                  <div>
                    <div className="form-group">
                      <input type="text"
                       onChange={(e)=>setSearchToken(e.target.value)}
                       className="form-control"
                       placeholder={displayToken?.
                        address || "search"}
                         />
                    </div>
                  </div>
                </div>

                {
                  displayToken ? (
                    <a onClick={()=>selectToken()} className="button button-1">
                      {shortenAddress(displayToken?.
                        address
                      )}
                      {displayToken?.symbol}
                    </a>
                  ) : (
                    ""
                  )

                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Token;
