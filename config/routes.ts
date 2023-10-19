export default [
  { path: '/', name: 'Main', icon: 'smile', component: './Index' },
  { path: '/interface_info/:id', name: 'API List', icon: 'smile', component: './InterfaceInfo', hideInMenu: true },
  {
    path: '/user',
    layout: false,
    routes: [{ name: 'login', path: '/user/login', component: './User/Login' }],
  },
  {
    path: '/admin',
    name: 'Manage',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { name: 'API Manage', icon: 'table', path: '/admin/interface_info', component: './Admin/InterfaceInfo' },
      //{ name: 'API Analyse', icon: 'analysis', path: '/admin/interface_analysis', component: './Admin/InterfaceAnalysis' },
    ],
  },

  // { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
