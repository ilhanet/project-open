import { useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet';
import LoadingBar from 'react-top-loading-bar';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store';

import './App.css';
import './index.css';

import { ThemeProvider } from '@/components/theme-provider';

import Home from './pages/Home';
import Post from './pages/Posts';
import HomeVideos from './pages/HomeVideos';
import Profile from './pages/Profile';
import NewPost from './pages/newpost/NewPost';
import More from './pages/More';
import EditProfile from './pages/EditProfile';
import CompleteRegister from './pages/auth/CompleteRegister';
import LoginEmail from './pages/auth/LoginEmail';
import ResetPassword from './pages/auth/ResetPassword';
import NewPassword from './pages/auth/NewPassword';
import NewEmail from './pages/auth/NewEmail';
import Login from './pages/auth/Login';
import ReportPost from './pages/report/ReportPost';
import ReportProfile from './pages/report/ReportProfile';
import Photo from './pages/Photo';
import Search from './pages/search/Search';
import SearchProfile from './pages/search/SearchProfile';
import SearchPosts from './pages/search/SearchPosts';
import Group from './pages/Group';
import ProfileGroups from './pages/ProfileGroups';
import NewPostGroup from './pages/newpost/NewPostGroup';
import ReportGroup from './pages/report/ReportGroup';
import CreateGroup from './pages/CreateGroup';
import Notifications from './pages/Notifications';
import NewPostLive from './pages/newpost/NewPostLive';
import EditGroup from './pages/EditGroup';
import NotFoundPage from './pages/NotFound';
import PrivacyAndCookiesPolicies from './pages/policies/PrivacyAndCookiesPolicies';
import TermsPolicies from './pages/policies/Terms';
import DeletedUser from './pages/auth/DeletedUser';

import axios from 'axios';
import Comments from './pages/Comments';
import GroupMembers from './pages/GroupMembers';
import SearchGroupsProfile from './pages/search/SearchGroupProfile';
import GroupsFollowing from './pages/GroupsFollowing';
import Signup from './pages/auth/Signup';
import ChangeUsername from './pages/ChangeUsername';
import TermsPoliciesEN from './pages/policies/TermsEN';
import PrivacyAndCookiesPoliciesEN from './pages/policies/PrivacyAndCookiesPoliciesEN';
import PageHome from './pages/PageHome';
import NewArticle from './pages/newpost/NewArticle';
import CommunityGuidelinesEN from './pages/policies/CommunityGuidelinesEN';
import CommunityGuidelines from './pages/policies/CommunityGuidelines';
import Policies from './pages/policies/Policies';
import ConfirmEmail from './pages/auth/ConfirmEmail';
import ReportCopyright from './pages/report/ReportCopyright';
import ReplyCopyright from './pages/report/ReplyCopyright';
import Admin from './pages/admin/Admin';
import AdminUsersBlocked from './pages/admin/AdminUsersBlocked';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSearch from './pages/admin/AdminSearch';
import AdminGroup from './pages/admin/AdminGroup';
import AdminPosts from './pages/admin/AdminPosts';
import AdminUsersCountry from './pages/admin/AdminUsersCountry';
import TwoFAEmail from './pages/auth/2fa/2FAEmail';
import TwoFA from './pages/auth/2fa/2FA';
import EditArticle from './pages/newpost/EditArticle';
import GoLink from './pages/GoLink';
import RepostPage from './pages/newpost/RepostPage';
import NewPetition from './pages/newpost/NewPetition';
import Petition from './pages/Petition';
import RepostPetition from './pages/newpost/RepostPetition';
import EditPetition from './pages/newpost/EditPetition';
import ReportPetition from './pages/report/ReportPetition';
import RepostVideo from './pages/newpost/RepostVideo';
import AdminCSP from './pages/admin/AdminCSP';
import SavedPosts from './pages/SavedPosts';
import ChangeLanguage from './pages/ChangeLanguage';
import SearchPostsUsers from './pages/search/SearchPostsUsers';
import Followers from './pages/Followers';
import Following from './pages/Following';
import UpdatesPost from './pages/UpdatesPost';
import EditPost from './pages/newpost/EditPost';
import NewPostAnother from './pages/newpost/NewPostAnother';
import TwoFADevice from './pages/auth/2fa/2FADevice';
import PrivacyApp from './pages/policies/PrivacyApp';
import PrivacyAppEN from './pages/policies/PrivacyAppEN';

axios.defaults.baseURL = 'https://api.ilhanet.com';
axios.defaults.withCredentials = true;

const Wrapper = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
}

function AppContent() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Helmet>
          <title>Ilhanet</title>
        </Helmet>

        <BrowserRouter>
          <LoadingBar color='#395FEA' progress={100} height='4px' />

          <Wrapper>
            <Routes>
              <Route path='/' element={currentUser ? <Home /> : <PageHome />} />
              <Route path='/:userId/post/:id' element={<Post />} />
              <Route path='/:userId/followers' element={currentUser ? <Followers /> : <Navigate replace to="/auth/login" />} />
              <Route path='/:userId/following' element={currentUser ? <Following /> : <Navigate replace to="/auth/login" />} />

              <Route path='updates_post/:id' element={<UpdatesPost />} />

              <Route path='comment/:id' element={<Comments />} />
              <Route path='go/:id' element={<GoLink />} />

              <Route path='videos' element={currentUser ? <HomeVideos /> : <Navigate replace to="/auth/login?redirect=videos" />} />
              <Route path='notifications' element={currentUser ? <Notifications /> : <Navigate replace to="/auth/login?redirect=notifications" />} />
              <Route path='*' element={<NotFoundPage />} />

              <Route path='/:id' element={<Profile />} />
              <Route path='/:id/groups' element={<ProfileGroups />} />
              <Route path='/:id/posts-tag' element={<SearchPostsUsers/>} />

              <Route path='group/:id' element={<Group />} />

              <Route path='newgroup' element={currentUser ? <CreateGroup /> : <Navigate replace to="/auth/login?redirect=newgroup" />} />
              <Route path='newpost/group/:id' element={<NewPostGroup />} />
              <Route path='newpost/another' element={<NewPostAnother />} />
              <Route path='newarticle' element={<NewArticle />} />
              <Route path='newpetition' element={<NewPetition />} />

              <Route path='more' element={currentUser ? <More /> : <Navigate replace to="/auth/login?redirect=more" />} />

              <Route path='/u'>
                <Route path='followedgroups' element={currentUser ? <GroupsFollowing /> : <Navigate replace to="/auth/login?redirect=u/followedgroups" />} />
                <Route path='editprofile' element={currentUser ? <EditProfile /> : <Navigate replace to="/auth/login?redirect=u/editprofile" />} />
                <Route path='editprofile/username' element={currentUser ? <ChangeUsername /> : <Navigate replace to="/auth/login?redirect=u/editprofile/username" />} />
                <Route path='editarticle/:id' element={currentUser ? <EditArticle /> : <Navigate replace to="/auth/login?redirect=u/editarticle/:id" />} />
                <Route path='editpetition/:id' element={currentUser ? <EditPetition /> : <Navigate replace to="/auth/login?redirect=u/editpetition/:id" />} />
                <Route path='editgroup/:id' element={currentUser ? <EditGroup /> : <Navigate replace to="/auth/login?redirect=u/editgroup/:id" />} />
                <Route path='savedposts' element={currentUser ? <SavedPosts /> : <Navigate replace to="/auth/login?redirect=u/savedposts" />} />
                <Route path='editpost/:id' element={currentUser ? <EditPost /> : <Navigate replace to="/auth/login?redirect=u/editgroup/:id" />} />
              </Route>

              <Route path='/:userId/post/:id/photo/:id' element={<Photo />} />

              <Route path='/i/policies'>
                <Route path='' element={<Policies />} />
                <Route path='privacy-cookies' element={<PrivacyAndCookiesPoliciesEN />} />
                <Route path='terms' element={<TermsPoliciesEN />} />
                <Route path='community' element={<CommunityGuidelinesEN />} />
                <Route path='privacy-app' element={<PrivacyAppEN />} />
                <Route path='pt/privacy-cookies' element={<PrivacyAndCookiesPolicies />} />
                <Route path='pt/terms' element={<TermsPolicies />} />
                <Route path='pt/community' element={<CommunityGuidelines />} />
                <Route path='pt/privacy-app' element={<PrivacyApp />} />
              </Route>

              <Route path='/i/lang' element={<ChangeLanguage />} />

              <Route path='search' element={currentUser ? <Search /> : <Navigate replace to="/auth/login?redirect=search" />} />
              <Route path='search/users' element={currentUser ? <SearchProfile /> : <Navigate replace to="/auth/login?redirect=search" />} />
              <Route path='search/posts' element={currentUser ? <SearchPosts /> : <Navigate replace to="/auth/login?redirect=search" />} />

              <Route path='group/members/:id' element={<GroupMembers />} />
              <Route path='group/members/:id/search' element={<SearchGroupsProfile />} />

              <Route path='/newpost'>
                <Route path='' element={currentUser ? <NewPost /> : <Navigate replace to="/auth/login?redirect=newpost" />} />
                <Route path='live-rumble' element={currentUser ? <NewPostLive /> : <Navigate replace to="/auth/login?redirect=newpost/live-rumble" />} />
                <Route path='video/:id/:index' element={currentUser ? <RepostVideo /> : <Navigate replace to="/auth/login?redirect=newpost/video/:id/:index" />} />
              </Route>

              <Route path='repost' element={currentUser ? <RepostPage /> : <Navigate replace to="/auth/login" />} />
              <Route path='repost/petition' element={currentUser ? <RepostPetition /> : <Navigate replace to="/auth/login" />} />

              <Route path='petition/:id' element={<Petition />} />

              <Route path='/auth'>
                <Route path='login' element={currentUser ? <Navigate replace to="/" /> : <Login />} />
                <Route path='signup' element={<Signup />} />
                <Route path='complete-register' element={currentUser ? <CompleteRegister /> : <Navigate replace to="/" />} />
                <Route path='login-email' element={ <LoginEmail />} />
                <Route path='reset-password' element={currentUser ? <Navigate replace to="/" /> : <ResetPassword />} />
                <Route path='new-password/:id' element={<NewPassword />} />
                <Route path='new-email/:id' element={<NewEmail />} />
                <Route path='2fa' element={currentUser ? <Navigate replace to="/" /> : <TwoFA />} />
                <Route path='2fa-email/:id' element={currentUser ? <Navigate replace to="/" /> : <TwoFAEmail />} />
                <Route path='2fa-device/:id' element={currentUser ? <Navigate replace to="/" /> : <TwoFADevice />} />
              </Route>

              <Route path='deleted-user/:id' element={<DeletedUser />} />
              <Route path='confirm-email/:id' element={<ConfirmEmail />} />

              <Route path='/report'>
                <Route path='post/:id' element={<ReportPost />} />
                <Route path='profile/:id' element={<ReportProfile />} />
                <Route path='petition/:id' element={<ReportPetition />} />
                <Route path='group/:id' element={<ReportGroup />} />
                <Route path='dmca' element={currentUser ? <ReportCopyright /> : <Navigate replace to="/auth/login?redirect=report/dmca" />} />
                <Route path='dmca-reply' element={currentUser ? <ReplyCopyright /> : <Navigate replace to="/auth/login?redirect=report/dmca-reply" />} />
              </Route>

              <Route path='studiolive' element={currentUser ? <StudioLive /> : <Navigate replace to="/auth/login?redirect=u/followedgroups" />} />

              <Route path='admin' element={currentUser ? <Admin /> : <Navigate replace to="/auth/login" />} />
              <Route path='/admin'>
                <Route path='users-blocked' element={currentUser ? <AdminUsersBlocked /> : <Navigate replace to="/auth/login" />} />
                <Route path='profile/:id' element={currentUser ? <AdminProfile /> : <Navigate replace to="/auth/login" />} />
                <Route path='post/:id' element={currentUser ? <AdminPosts /> : <Navigate replace to="/auth/login" />} />
                <Route path='group/:id' element={currentUser ? <AdminGroup /> : <Navigate replace to="/auth/login" />} />
                <Route path='search' element={currentUser ? <AdminSearch /> : <Navigate replace to="/auth/login" />} />
                <Route path='users-countries' element={currentUser ? <AdminUsersCountry /> : <Navigate replace to="/auth/login" />} />  
              </Route>
            </Routes>
          </Wrapper>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
