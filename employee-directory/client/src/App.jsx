import { useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('employee-directory-settings') || '{}');
      document.documentElement.dataset.theme = settings.darkMode === false ? 'light' : 'dark';
    } catch {
      document.documentElement.dataset.theme = 'dark';
    }

    const selector = 'button, a, .nav-link, .button-link, .hero-primary, .hero-secondary, .logout-btn, .small-button, .status-pill, .stat-card';

    const handlePointerDown = (event) => {
      const element = event.target.closest(selector);

      if (!element || element.disabled) {
        return;
      }

      element.classList.remove('click-burst');
      void element.offsetWidth;
      element.classList.add('click-burst');

      if (element._clickBurstTimer) {
        clearTimeout(element._clickBurstTimer);
      }

      element._clickBurstTimer = setTimeout(() => {
        element.classList.remove('click-burst');
      }, 260);
    };

    const handleSpeechClick = (event) => {
      const target = event.target;
      const selection = window.getSelection();

      if (selection && !selection.isCollapsed) {
        return;
      }

      if (!(target instanceof Element) || target.closest('input, select, textarea, option, [contenteditable="true"]')) {
        return;
      }

      const element = target.closest('button, a, [role="button"], [role^="menuitem"], [role="option"]');

      if (!element || element.disabled || element.getAttribute('aria-disabled') === 'true') {
        return;
      }

      const label = element.getAttribute('aria-label') || (() => {
        const labelElement = element.cloneNode(true);
        labelElement.querySelectorAll('[aria-hidden="true"]').forEach((hiddenElement) => hiddenElement.remove());
        return labelElement.innerText || labelElement.textContent;
      })();
      const text = label.trim().replace(/\s+/g, ' ');

      if (text && window.speechSynthesis && window.SpeechSynthesisUtterance) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(text));
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('click', handleSpeechClick);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('click', handleSpeechClick);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <ProtectedRoute path="/dashboard">
            <Dashboard />
          </ProtectedRoute>
          <ProtectedRoute path="/employees">
            <Employees />
          </ProtectedRoute>
          <ProtectedRoute path="/departments">
            <Departments />
          </ProtectedRoute>
          <ProtectedRoute path="/analytics">
            <Analytics />
          </ProtectedRoute>
          <ProtectedRoute path="/settings">
            <Settings />
          </ProtectedRoute>
          <Redirect to="/" />
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
