import Vue from 'vue'
import Router from 'vue-router'
import EditComp from '@/components/EditComp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'EditComp',
      component: EditComp
    }
  ]
})
