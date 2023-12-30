import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { BrowserRouter } from 'react-router-dom';
import { ImageValidationProvider } from './context/validators';
// import { LargeBannerProvider } from './context/BannerGetters';
import { SubCategoriesProvider } from './context/categoriesGetter';
import { MainCategoriesProvider } from './context/categoriesGetter';
import { ProductsProvider } from './context/productgetter';
import { ImageHandleProvider } from './context/ImageHandler'
import { BannerDataProvider } from './context/BannerGetters';
import { OrderContextProvider } from './context/OrderGetter';
import { CustomersProvider } from './context/Customergetters';
import { ServiceContextProvider } from './context/ServiceAreasGetter'


// Put any other imports below so that CSS from your
// components takes precedence over default styles.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ImageValidationProvider>
      <SubCategoriesProvider>
        <MainCategoriesProvider>
          <ProductsProvider>
            <ImageHandleProvider>
              <BannerDataProvider>
                <OrderContextProvider>
                  <CustomersProvider>
                    <ServiceContextProvider>
                      <App />
                    </ServiceContextProvider>
                  </CustomersProvider>
                </OrderContextProvider>
              </BannerDataProvider>
            </ImageHandleProvider>
          </ProductsProvider>
        </MainCategoriesProvider>
      </SubCategoriesProvider>
    </ImageValidationProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
