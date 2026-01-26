import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import {
  MdAccessibilityNew,
  MdMoney,
  MdMoreHoriz,
  MdOutlineAreaChart,
  MdOutlineDashboard,
  MdOutlineHistoryEdu,
  MdOutlineMonetizationOn,
  MdOutlineVisibility,
} from 'react-icons/md';
import { NavLink } from 'react-router';

export type NavProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'children'
>;

export function Nav(props: NavProps): ReactNode {
  return (
    <nav {...props} aria-label="Menu navigation">
      <NavLink to="/">
        <MdOutlineDashboard /> <span>Home</span>
      </NavLink>
      <NavLink to="/market" data-hide="desktop">
        <MdOutlineAreaChart /> <span>Market</span>
      </NavLink>
      <NavLink to="/fx">
        <MdOutlineMonetizationOn /> <span>FX</span>
      </NavLink>
      <NavLink to="/watch">
        <MdOutlineVisibility /> <span>Watch</span>
      </NavLink>
      <NavLink to="/moneybook">
        <MdMoney /> <span>Moneybook</span>
      </NavLink>
      <NavLink to="/body">
        <MdAccessibilityNew /> <span>Body</span>
      </NavLink>
      <NavLink to="/journal">
        <MdOutlineHistoryEdu /> <span>Journal</span>
      </NavLink>
      <NavLink to="/more">
        <MdMoreHoriz /> <span>More</span>
      </NavLink>
    </nav>
  );
}
