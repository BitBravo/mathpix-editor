/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import Editor from 'containers/Editor/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import './style.scss';

const App = () => (
  <div className="container">
    <Helmet
      titleTemplate="%s - Markedown Editor"
      defaultTitle="Markedown Editor"
    >
      <meta name="description" content="This is a Markedown Editor" />
    </Helmet>
    <Header />
    <Switch>
      <Route exact path="/" component={Editor} />
      <Route path="/test" component={FeaturePage} />
      <Route path="" component={NotFoundPage} />
    </Switch>
    <Footer />
  </div>
);

export default App;
