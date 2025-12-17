export interface SubMenu {
  menuId: string;
  menuName: string;
  icon: string | null;
  link: string | null;
  subMenus: null;
}

export interface MenuItem {
  menuId: string;
  menuName: string;
  icon: string | null;
  link: string | null;
  subMenus: SubMenu[] | null;
  expanded?: boolean; // Optional property for UI state
}
export type MenuStructure = MenuItem[];

