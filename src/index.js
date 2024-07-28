import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { BrowserRouter } from "react-router-dom";
import { ImageValidationProvider } from "./context/validators";
// import { LargeBannerProvider } from './context/BannerGetters';
import { SubCategoriesProvider } from "./context/categoriesGetter";
import { MainCategoriesProvider } from "./context/categoriesGetter";
import { ProductsProvider } from "./context/productgetter";
import { ImageHandleProvider } from "./context/ImageHandler";
import { BannerDataProvider } from "./context/BannerGetters";
import { OrderContextProvider } from "./context/OrderGetter";
import { CustomersProvider } from "./context/Customergetters";
import { ServiceContextProvider } from "./context/ServiceAreasGetter";
import { DeliverManContextProvider } from "./context/DeliverymanGetter";
import { FaqProvider } from "./context/Faq";
import { UserAuthContextProvider } from "./context/Authcontext";
import { CouponContextProvider } from "./context/CouponsGetter";
import { BrandContextProvider } from "./context/BrandsContext";
import { ChatProvider } from "./context/ChatRoom";
import { NotificationProvider } from "./context/NotificationContext";
import { ComplainContextProvider } from "./context/ComplainsGetter";
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <NotificationProvider>
      <ComplainContextProvider>
        <UserAuthContextProvider>
          <ImageValidationProvider>
            <SubCategoriesProvider>
              <MainCategoriesProvider>
                <ProductsProvider>
                  <ImageHandleProvider>
                    <BannerDataProvider>
                      <OrderContextProvider>
                        <CustomersProvider>
                          <ServiceContextProvider>
                            <FaqProvider>
                              <DeliverManContextProvider>
                                <CouponContextProvider>
                                  <BrandContextProvider>
                                    <ChatProvider>
                                      <App />
                                    </ChatProvider>
                                  </BrandContextProvider>
                                </CouponContextProvider>
                              </DeliverManContextProvider>
                            </FaqProvider>
                          </ServiceContextProvider>
                        </CustomersProvider>
                      </OrderContextProvider>
                    </BannerDataProvider>
                  </ImageHandleProvider>
                </ProductsProvider>
              </MainCategoriesProvider>
            </SubCategoriesProvider>
          </ImageValidationProvider>
        </UserAuthContextProvider>
      </ComplainContextProvider>
    </NotificationProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// Register service worker
serviceWorkerRegistration.register();
