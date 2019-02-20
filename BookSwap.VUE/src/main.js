import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Router from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import firebase from 'firebase';
import { VueMasonryPlugin } from 'vue-masonry';
import VueChatScroll from 'vue-chat-scroll'
import config from "./config.json";
import session from "./session";
import Notify from 'vue2-notify'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import HomeComponent from "./components/Home.vue";
import SearchComponent from "./components/Search.vue";
import PostComponent from "./components/Post.vue";
import LoginComponent from "./components/Login.vue";
import RegisterComponent from "./components/Register.vue";
import ProfileComponent from "./components/Profile.vue";

Vue.config.productionTip = true;

axios.defaults.baseURL = config.api_url;

firebase.initializeApp(config.firebase);

Vue.use(VueMasonryPlugin);
Vue.use(VueAxios, axios);
Vue.use(Router);
Vue.use(VueChatScroll);
Vue.use(BootstrapVue);
Vue.use(Notify, { visibility: 5000, position: "top-full" });

let router = new Router({
    base: __dirname,
    linkExactActiveClass: "active",
    routes: [
        { path: '/', name: "home", component: HomeComponent },
        { path: '/search', name: "search", component: SearchComponent },
        { path: '/post/:id', name: "editpost", component: PostComponent, meta: { requiresAuth: true } },
        { path: '/post', name: "createpost", component: PostComponent, meta: { requiresAuth: true } },
        { path: '/login', name: "login", component: LoginComponent },
        { path: '/register', name: 'register', component: RegisterComponent },
        { path: '/profile', name: 'profile', component: ProfileComponent, meta: { requiresAuth: true } }
    ]
});

router.beforeEach((to, from, next) => {
    const loggedIn = session.isset();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    if (requiresAuth && !loggedIn) {
        router.push({ path: '/login', query: { redirectTo: to.path } });
    } else {
        next();
    }
});

new Vue({
    router: router,
    render: h => h(App)
}).$mount('#app');
