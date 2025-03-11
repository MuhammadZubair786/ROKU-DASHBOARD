import { useEffect } from 'react';

import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import PostPage from './pages/ProductPage';
import DashboardAppPage from './pages/DashboardAppPage';
import ContentPage from './pages/ContentPage';
import NotificationPage from './pages/NotificationPage';
import Meal from './pages/Meal';
import Exercise from './pages/Exercise';
import RequestPage from './pages/RequestPage';
import Diet from './pages/Diet';
import Nutrition from './pages/Nutrition';
import Routine from './pages/Routine';
import Orders from './pages/OrdersPage';
import LeagugeList from './pages/LeagugePage';
import OrderManagement from './pages/OrderPage';
import TransportationManagement from './pages/TransportationMangemnet';
import PromotionalCodeManagement from './pages/PromotionalCode';
import BannerManagement from './pages/BannerMangement';
import FlashSaleManagement from './pages/FlashMangement';
import EventManagementAdmin from './pages/EventMangemnet';
import NewsManagement from './pages/OrderMangement';
import PointsAccumulation from './pointsLevelMangement';
import TeamList from './pages/TeamPage';
import StandingLeagues from './pages/standing';


export default function Router() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      console.log('1');
    } else {
      console.log('2');
    }
  }, []);
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        // { path: 'standing', element: <StandingLeagues /> },
        // { path: 'leaguge', element: <LeagugeList /> },
        // { path: 'team', element: <TeamList /> },

        // { path: 'order', element: <OrderManagement /> },
        // { path: 'transport', element: <TransportationManagement /> },
        // { path: 'promotionalCode', element: <PromotionalCodeManagement /> },
        // { path: 'flash_sale', element: <FlashSaleManagement /> },
        // { path: 'event_management', element: <EventManagementAdmin /> },
        // { path: 'news_management', element: <NewsManagement /> },
        // { path: 'points_management', element: <PointsAccumulation /> },

        // { path: 'banner', element: <BannerManagement /> },
        // { path: 'content', element: <ContentPage /> },
        // { path: 'subscription', element: <PostPage /> },
        // { path: 'notification', element: <NotificationPage /> },
        // { path: 'request', element: <RequestPage /> },
        // { path: 'meal', element: <Meal /> },
        // { path: 'exercise', element: <Exercise /> },
        // { path: 'diet', element: <Diet /> },
        // { path: 'orders', element: <Orders /> },
        // // { path: 'nutrition', element: <Nutrition /> },
        // { path: 'routine', element: <Routine /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
