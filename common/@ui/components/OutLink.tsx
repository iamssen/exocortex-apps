import type { AnchorHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

export type OutLinkProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export function OutLink({ href, ...props }: OutLinkProps): ReactNode {
  //if ('standalone' in window.navigator || window.navigator.standalone) {
  //  return (
  //    <a
  //      href={href}
  //      rel="noreferrer"
  //      target="_blank"
  //      {...props}
  //      onClick={(event) => {
  //        event.preventDefault();
  //        window.open(href, '_blank');
  //      }}
  //    />
  //  );
  //} else {
  return <a href={href} rel="noreferrer" target="_blank" {...props} />;
  //}
}
