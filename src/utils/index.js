import buildLogo from '../components/logo'
import store from '../store'
import router from '../router'

const SET_TIME = (A, B) => setTimeout(() => A(), B)

const SET_INT = (C, D) => setInterval(() => C(), D)

const SET_SESSION = (E, F) => sessionStorage.setItem(E, F)
const GET_SESSION = G => sessionStorage.getItem(G)
const DEL_SESSION = K => sessionStorage.removeItem(K);

const SET_LOCAL = (H, I) => localStorage.setItem(H, I)
const GET_LOCAL = J => localStorage.getItem(J)


const SET_LOGO = _THIS => _THIS.$store.commit('setLogo', buildLogo());
const DEL_LOGO = _THIS => {
  _THIS.LOGO ? _THIS.LOGO.$root.$options.clear() : null;
  _THIS.$store.commit("setLogo", null);
}

const COMMIT = (STR, DATA) => store.commit(STR, DATA);
const PUSH = URL => router.push(URL);
const DISPATCH = (STR, DATA) => store.dispatch(STR, DATA);


const PARAMS = _this => _this.$route.params;
const ROUTE = _this => _this.$route;

const TRIM = (s) => s.replace(/(^\s*)|(\s*$)/g, "");


export {
  SET_TIME,
  SET_INT,
  SET_SESSION,
  GET_SESSION,
  DEL_SESSION,
  SET_LOCAL,
  GET_LOCAL,
  SET_LOGO,
  DEL_LOGO,
  COMMIT,
  PUSH,
  DISPATCH,
  PARAMS,
  ROUTE,
  TRIM,
};
