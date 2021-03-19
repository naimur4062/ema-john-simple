import React from 'react';
import { useParams } from 'react-router-dom';
import fakeData from '../../fakeData';
import Product from '../Product/Product';

const ProductDetails = () => {
    const {productKey} = useParams();
    const product = fakeData.find(pd => pd.key === productKey);
    console.log(product)
    return (
        <div>
            <h1>{productKey} is product details.</h1>
            <Product product={product} showAddToCart={false}></Product>
        </div>
    );
};

export default ProductDetails;