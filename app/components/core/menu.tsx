"use client";

import React from "react";
import { Menu as HeadlessMenu } from "@headlessui/react";

export const DropdownMenu = ({ children, menu, ...props }: any) => {
  return (
    <HeadlessMenu
      as="div"
      style={{ position: "relative", display: "inline-block" }}
    >
      <HeadlessMenu.Button as={React.Fragment}>{children}</HeadlessMenu.Button>
      <HeadlessMenu.Items
        className="z-10 absolute right-0 mt-2 w-[300px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        {...props}
      >
        {menu}
      </HeadlessMenu.Items>
    </HeadlessMenu>
  );
};

export const Menu = (props: any) => <div className="divide-y" {...props} />;

export const MenuGroup = ({ children }: {children: React.ReactNode}) => {
  return <div className="py-2">{children}</div>;
};

export const MenuItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <HeadlessMenu.Item
      as="a"
      href={href}
      className="group flex w-full items-center px-4 py-2 text-sm ui-active:bg-orange-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-neutral-900"
    >
      {children}
    </HeadlessMenu.Item>
  );
};
