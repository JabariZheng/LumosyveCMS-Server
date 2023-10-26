export default [
  {
    id: '1',
    path: '/system',
    redirect: '/sys/office/index',
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
        path: '/sys/office/index',
        component: '/sys/office/index',
        children: [],
        meta: {
          icon: 'icon-grid',
          hideMenu: false,
          color: '',
          title: '机构管理',
        },
        name: 'ViewsSysOfficeIndex',
        id: '1148141436257779712',
        leaf: false,
        url: '/sys/office/index',
        target: '',
      },
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
      {
        path: '/sys/role/list',
        component: '/sys/role/list',
        meta: {
          icon: 'icon-people',
          hideMenu: false,
          color: '',
          title: '角色管理',
        },
        name: 'ViewsSysRoleList',
        id: '1148141438510120960',
        leaf: true,
        url: '/sys/role/list',
        target: '',
      },
      {
        path: '/sys/menu/index',
        component: '/sys/menu/index',
        meta: {
          icon: 'icon-book-open',
          hideMenu: false,
          color: '',
          title: '菜单管理',
        },
        name: 'ViewsSysMenuIndex',
        id: '1148141438824693760',
        leaf: true,
        url: '/sys/menu/index',
        target: '',
      },
      {
        path: '/sys/dictType/list',
        component: '/sys/dictType/list',
        children: [],
        meta: {
          icon: 'icon-social-dropbox',
          hideMenu: false,
          color: '',
          title: '字典管理',
        },
        name: 'ViewsSysDictTypeList',
        id: '1148141439063769088',
        leaf: false,
        url: '/sys/dictType/list',
        target: '',
      },
    ],
    leaf: false,
    url: '',
    target: '',
  },
];
