import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from '../pages/home';
import Category from '../pages/category';
import Product from '../pages/product';
import Login from '../pages/login';
import Signup from '../pages/signup';
import Profile from '../pages/profile';
import Cart from '../pages/cart';
import Checkout from '../pages/checkout';
import AdminUser from '../pages/admin-user';
import AdminCategory from '../pages/admin-category';
import AdminProduct from '../pages/admin-product';
import formProduct from '../pages/form/form-product';

const MainRoute = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/category/:id_category" component={Category}/>
                <Route exact path="/product/:id_product" component={Product}/>
                <Route exact path="/login/" component={Login}/>
                <Route exact path="/signup/" component={Signup}/>
                <Route exact path="/profile/" component={Profile}/>
                <Route exact path="/cart/" component={Cart}/>
                <Route exact path="/checkout/" component={Checkout}/>
                <Route exact path="/form-product/" component={formProduct}/>
                <Route exact path="/admin-user/" component={AdminUser}/>
                <Route exact path="/admin-category/" component={AdminCategory}/>
                <Route exact path="/admin-product/" component={AdminProduct}/>
            </Switch>
        </BrowserRouter>
    )
}
export default MainRoute;