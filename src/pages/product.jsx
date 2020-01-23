import React from 'react';
import Header from '../component/header';
import { withRouter } from 'react-router-dom';
import { connect } from 'unistore/react';
import { actions, store } from '../store';
import { Link } from 'react-router-dom';
import ProductData from './data/product-data';
import axios from 'axios';

class Product extends React.Component {
  state = {
    listProduct: [],
    isLoading: true,
    id_category: 0,
    id_product: 0
  };
  axiosProductData = async () => {
    const self = this;
    const id_product = this.props.match.params.id_product;
    await axios
      .get(`https://hijub.my.id/product/${id_product}`)
      .then(function(response) {
        store.setState({ product: response.data, isLoading: false });
        store.setState({ id_product: id_product });
        self.setState({ id_category: response.data.id_kategori });
        self.setState({ id_product: response.data.id });
      })
      .catch(function(error) {
        store.setState({ isLoading: false });
      });
  };
  axiosProductDataEvent = async event => {
    const self = this;
    await axios
      .get(`https://hijub.my.id/product/${event}`)
      .then(function(response) {
        store.setState({ product: response.data, isLoading: false });
        store.setState({ id_product: event });
        self.setState({ id_category: response.data.id_kategori });
        self.setState({ id_product: response.data.id });
      })
      .catch(function(error) {
        store.setState({ isLoading: false });
      });
  };
  componentDidMount = async () => {
    const self = this;
    await this.axiosProductData();
    this.axiosProduct();
  };
  axiosProduct = async () => {
    const self = this;
    await axios
      .get(`https://hijub.my.id/product?id_kategori=${self.state.id_category}`)
      .then(function(response) {
        self.setState({ listProduct: response.data, isLoading: false });
      })
      .catch(function(error) {
        self.setState({ isLoading: false });
      });
  };
  render() {
    const { listProduct } = this.state;
    const listProductFilter = listProduct.filter(item => {
      if (item.id !== this.state.id_product) {
        return item;
      }
      return false;
    });
    const arrayProduct = listProductFilter.map((item, key) => {
      return (
        <div className="col-md-4 py-3">
          <div className="product-img">
            <Link
              to={`/product/${item.id}`}
              onClick={event => this.axiosProductDataEvent(`${item.id}`)}
            >
              <img src={item.gambar} alt="" />
            </Link>
          </div>
          <div className="product-caption">
            <Link
              to={`/product/${item.id}`}
              onClick={event => this.axiosProductDataEvent(`${item.id}`)}
            >
              <p className="my-0">{item.nama}</p>
            </Link>
            <Link
              to={`/product/${item.id}`}
              onClick={event => this.axiosProductDataEvent(`${item.id}`)}
            >
              <p className="my-0">Rp. {item.harga}</p>
            </Link>
          </div>
        </div>
      );
    });
    return (
      <div>
        <Header />
        <div className="container-fluid home-content">
          <ProductData />
          <div className="detail-product-border">
            <div className="row">
              <div className="col-md-12"></div>
            </div>
          </div>
          <div className="container">
            <div className="row align-items-center pt-5">
              <div className="col-md-12 category-judul">
                <h3 style={{ color: '#6405ad' }}>Kategori {this.props.product.id_kategori}</h3>
              </div>
            </div>
            <div className="row align-items-center home-category">{arrayProduct}</div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(
  'product, isLoading, id_product, id_cart, jumlah_item',
  actions
)(withRouter(Product));
