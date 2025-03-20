// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('dashboard-layout-svgrepo-com'),
  },
  {
    title: 'Direct CSV FILE',
    path: '/dashboard/user',
    icon: icon('user-circle-svgrepo-com'),
  },
  {
    title: 'Store Csv Analytics',
    path: '/dashboard/newRoku',
    icon: icon('post-svgrepo-com'),
  },
  // {
  //   title: 'Team',
  //   path: '/dashboard/team',
  //   icon: icon('post-svgrepo-com'),
  // },
  // {
  //   title: 'Standing Leaguge',
  //   path: '/dashboard/standing',
  //   icon: icon('post-svgrepo-com'),
  // },
  // {
  //   title: 'Active Match Up',
  //   path: '/dashboard/event_management',
  //   icon: icon('post-svgrepo-com'),
  // },
  // {
  //   title: 'Approve Leaguge',
  //   path: '/dashboard/order',
  //   icon: icon('post-svgrepo-com'),
  // },
  // {
  //   title: 'Draft Mangement',
  //   path: '/dashboard/transport',
  //   icon: icon('post-svgrepo-com'),
  // },
  // {
  //   title: 'Roaster Mangement',
  //   path: '/dashboard/promotionalCode',
  //   icon: icon('post-svgrepo-com'),
  // },
  // {
  //   title: 'Banner Mangement',
  //   path: '/dashboard/banner',
  //   icon: icon('post-svgrepo-com'),
  // },
  // {
  //   title: 'Flash Sale Management',
  //   path: '/dashboard/flash_sale',
  //   icon: icon('post-svgrepo-com'),
  // },
  // {
  //   title: 'News Management',
  //   path: '/dashboard/news_management',
  //   icon: icon('post-svgrepo-com'),
  // },
  // {
  //   title: 'Points Management',
  //   path: '/dashboard/points_management',
  //   icon: icon('post-svgrepo-com'),
  // },
  {
    title: 'View OR Add Csv',
    path: '/dashboard/content',
    icon: icon('content-email-inbox-mail-message-icon-svgrepo-com'),
  },
  // {
  //   title: 'Notifications',
  //   path: '/dashboard/notification',
  //   icon: icon('notification-bell-1397-svgrepo-com'),
  // },

  {
    title: 'logout',
    path: '/login',
    icon: icon('logout-svgrepo-com'),
  },
];

export default navConfig;
