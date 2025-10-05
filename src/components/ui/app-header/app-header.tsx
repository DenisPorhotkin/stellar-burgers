import { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

const isActive = (path: string, exact: boolean = false) => {
  if (exact) {
    return location.pathname === path;
  }
  return location.pathname.startsWith(path);
};

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          className={`${styles.link} ${
            isActive('/', true) ? styles.link_active : ''
          }`}
          end
        >
          <BurgerIcon type={isActive('/', true) ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </NavLink>

        <NavLink
          to='/feed'
          className={`${styles.link} ${
            isActive('/feed') ? styles.link_active : ''
          }`}
        >
          <ListIcon type={isActive('/feed') ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </NavLink>
      </div>

      <div className={styles.logo}>
        <NavLink to='/'>
          <Logo className='' />
        </NavLink>
      </div>

      <div className={styles.link_position_last}>
        <NavLink
          to='/profile'
          className={`${styles.link} ${
            isActive('/profile') ? styles.link_active : ''
          }`}
        >
          <ProfileIcon type={isActive('/profile') ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </div>
    </nav>
  </header>
);
