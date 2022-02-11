import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ProductPageView } from '@/roanuz/view/product/page';
import { EnquiryFormController } from '@/roanuz/controller/product/enquiryForm';
import { DailogView } from '@/roanuz/view/dialog';
import { useMutation } from '@apollo/client';
import { StockAlertMutation } from '@/store/customer/query';
import { Text14 } from '@/roanuz/typopgraphy';
import { AddToCart } from './addToCart';
import { ProductSpecController } from './spec';
import { AddToWishList } from './addToWishList';
import { SiminnLoanOptionsController } from './siminnLoanOptions';
import { DeliveryPickupController } from './deliveryPickupTimes';

export const ProductPage = ({
  product,
  productBrand,
}) => {
  const initState = {
    withProduct: null,
  };

  const [showEnquiryForm, setShowEnquiryForm] = useState();
  const [showStockAlertConfirm, setShowStockAlertConfirm] = useState();

  const [
    createStockAlert,
    { loading: stockAlertLoading, error: stockAlertError },
  ] = useMutation(StockAlertMutation, {
    onCompleted: (data) => {
      if (data && !stockAlertError) {
        setShowStockAlertConfirm(true);
      }
    },
  });

  const [cartOption, setCartOption] = useState({ ...initState });
  const resetOption = () => {
    setCartOption({ ...initState });
  };

  useEffect(() => {
    resetOption();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.sku]);

  const specificationsList = ProductSpecController(product.sku);
  let mode = 'primary';

  if (!product.available) {
    mode = 'normal';
  } else if (product.isRefurbished) {
    mode = 'special';
  } else if (product.onDiscount || product.onSale) {
    mode = 'sale';
  }

  const acButton = (
    <AddToCart
      options={cartOption}
      product={product}
      onCartReset={resetOption}
      mode={mode}
      filled
      large
    />
  );

  const awButton = (
    <AddToWishList product={product} buttonText="Setja á óskalista" large hideTextOnMobile />
  );

  const onCartUpdate = (option, value) => {
    console.log('Cart Update', option, value);
    if (option === 'with-product') {
      setCartOption({
        ...cartOption,
        withProduct: value,
      });
    }
  };

  const onStockAlert = (email) => {
    createStockAlert({ variables: { email, productSku: product.sku } });
  };

  const onEnquiryForm = () => {
    setShowEnquiryForm(true);
  };

  const onEnquiryFormClose = () => {
    setShowEnquiryForm(false);
  };

  return (
    <>
      <ProductPageView
        product={product}
        productBrand={productBrand}
        specificationsList={specificationsList}
        addToCart={acButton}
        tabIndexStart={5}
        onCartUpdate={onCartUpdate}
        addToWishList={awButton}
        SiminnLoan={SiminnLoanOptionsController}
        DeliveryPickup={DeliveryPickupController}
        onEnquiryForm={onEnquiryForm}
        stockAlertLoading={stockAlertLoading}
        stockAlertError={stockAlertError}
        onStockAlert={onStockAlert}
      />
      <DailogView
        titleText="Fyrirspurn vegna sérpöntunnar"
        showClose
        onClose={onEnquiryFormClose}
        show={showEnquiryForm}
        containerWidth="440px"
      >
        <EnquiryFormController
          product={product}
        />
      </DailogView>
      <DailogView
        titleText="Skráning móttekin!"
        showClose
        onClose={() => { setShowStockAlertConfirm(false); }}
        show={showStockAlertConfirm}
        containerWidth="440px"
      >
        <Text14>
          Þér mun berast tölvupóstur um leið og varan verður aftur fáanleg
        </Text14>
      </DailogView>
    </>
  );
};

ProductPage.propTypes = {
  product: PropTypes.object.isRequired,
  productBrand: PropTypes.object,
};
