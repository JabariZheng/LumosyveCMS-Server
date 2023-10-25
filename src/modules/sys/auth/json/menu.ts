export default [
  {
    id: '1',
    path: '/system',
    redirect: '/sys/empUser/index',
    name: '系统管理',
    component: 'LAYOUT',
    meta: {
      icon: 'icon-settings',
      hideMenu: false,
      color: '',
      title: '系统管理',
    },
    children: [
      {
        path: '/sys/empUser/index',
        component: '/sys/empUser/index',
        children: [],
        meta: {
          icon: 'icon-user',
          hideMenu: false,
          color: '',
          title: '用户管理',
        },
        name: 'ViewsSysEmpUserIndex',
        id: '1148141434169016320',
        leaf: false,
        url: '/sys/empUser/index',
        target: '',
      },
    ],
    leaf: false,
    url: '',
    target: '',
  },
];
