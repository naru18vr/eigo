import React, { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import HomeIcon from './shared/HomeIcon';
import BookOpenIcon from './shared/BookOpenIcon';
import ChartBarIcon from './shared/ChartBarIcon';

export const isMenuRoute = (path: string) => path === '/' || /^\/(?:grade\/grade[123](?:\/unit\/[^/]+\/sets)?|vocabulary|eiken[34](?:\/(?:course|stamp-course|progress|try-it|grammar-practice-select|word-map))?|progress|guide|transfer|storage-recovery)$/.test(path);
const AppNavigation: React.FC = () => {
  const { pathname, search } = useLocation();
  const course = pathname.startsWith('/eiken3') ? '/eiken3' : pathname.startsWith('/eiken4') ? '/eiken4' : '';
  const showNavigation = isMenuRoute(pathname);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname, search]);
  const links = [
    { path: '/', label: 'ホーム', icon: HomeIcon, end: true },
    { path: course || '/vocabulary', label: course ? '学習メニュー' : '英単語', icon: BookOpenIcon, end: Boolean(course) },
    { path: course ? `${course}/progress` : '/progress', label: '学習記録', icon: ChartBarIcon, end: true },
  ];
  return <>
    <a href="#app-content" className="skip-link">学習内容へ移動</a>
    <header className="app-header"><div className="app-header-inner"><Link to="/" className="brand-link" aria-label="eigo ホーム"><span className="brand-symbol" aria-hidden="true">e</span><span>eigo<span className="brand-caption">英語を、ひとつずつ。</span></span></Link>{course && <Link to={course} className="course-badge">英検{course === '/eiken3' ? '3' : '4'}級</Link>}{!showNavigation && <span className="study-badge">✏️ 学習中</span>}</div></header>
    {showNavigation && <nav className="app-bottom-nav" aria-label="メインメニュー">{links.map(({ path, label, icon: Icon, end }) => <NavLink key={path} to={path} end={end} className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}><Icon className="h-5 w-5"/><span>{label}</span></NavLink>)}</nav>}
  </>;
};
export default AppNavigation;
