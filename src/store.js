import createStore from 'unistore';
// import { string } from 'prop-types';
// import axios from 'axios';

const initialState = {
  username: '',
  password: '',
  token: '',
  nama_lengkap: '',
  email: '',
  no_hp: '',
  isLogin: false,
  adminIsLogin: false,
  isLoading: true,
  listProduct: [],
  category: '',
  id_category: 1,
  product: {},
  id_product: 1,
  listCart: [],
  listCartDetail: [],
  productCart: {},
  alamatLengkap: '',
  id_cart: 0,
  jumlah_item: 0,
  listProductCheckout: [],
  listUser: [],
};
export const store = createStore(initialState);

export const actions = store => ({
  categoryHijab: async (state, event) => {
    store.setState({ category: event });
    if (event === 'Segi Empat') {
      store.setState({ id_category: 1 });
    } else if (event === 'Bergo') {
      store.setState({ id_category: 2 });
    } else if (event === 'Pashmina') {
      store.setState({ id_category: 3 });
    }
  }
});
