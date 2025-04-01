import React from "react";

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;
export const DropdownMenuContent: React.FC = () => <div>Content</div>;
export const DropdownMenuItem: React.FC = () => <div>Item</div>;
export const DropdownMenuGroup: React.FC = () => <div>Group</div>;
export const DropdownMenuLabel: React.FC = () => <div>Label</div>;
export const DropdownMenuSeparator: React.FC = () => <hr />;
export const DropdownMenuTrigger: React.FC = () => <button>Trigger</button>;
