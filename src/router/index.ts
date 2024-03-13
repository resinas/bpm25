import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import AuthPage from "@/views/AuthPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/home'
  },

  {
    path: '/tabs/',
    component: TabsPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/TabHome.vue')
      },
      {
        path: 'calendar',
        component: () => import('@/views/TabAgenda.vue'),
      },
      {
        path: 'attendees',
        component: () => import('@/views/TabAttendees.vue'),
      },
      {
        path: 'images',
        component: () => import('@/views/TabGallery.vue')
      },
      {
        path: 'page/:id',
        component: () => import('@/views/TabSinglePage.vue')
      },
      {
        path: 'about',
        component: () => import('@/views/TabAbout.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/TabSettings.vue')
      }
    ]
  },
  {
    path: '/auth/',
    component: AuthPage,
    children: [
      {
        path: '',
        redirect: '/auth/login'
      },
      {
        path: 'login',
        component: () => import('@/views/AuthLogin.vue')
      },
      {
        path: 'register',
        component: () => import('@/views/AuthRegister.vue')
      },
      {
        path: 'register/:token',
        component: () => import('@/views/AuthRegister.vue'),
        props: true, // Pass route.params to the component as props
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //Authentication check
    const token = localStorage.getItem('accessToken');
    if (token) {
      return next();
    }
    return next('/auth/login');
  }
  next();
})


export default router
