import { BookDashed,Contact,Settings,Bell, User,Boxes,Package,Store,ClipboardCheck,Layers,BarChart3,FileText,ListTree,LayoutList,Badge,Image,Sliders} from "lucide-react";

export const SidebarLinks = [
  {
    icon: BookDashed,
    title: "Dashboard",
    path: "/",
  },
  {
    title: "constituencies",path: "/constituencies",
    options: [
      // { title: "constituencies", path: "/vendor/vendors" },
      { title: "Add constituencies", path: "/constituencies/add-constituencies" },
      // { title: "Edit Vendor", path: "/vendor/edit-vendor" },
      // { title: "View Vendor", path: "/vendor/view-vendor" },
    ],
  },

   {
    title: "Mandal",
    path: "/Mandal",
    // options: [
    //   { title: "Add Mandal", path: "/Mandal/add-Mandal" },
    // ],
  },

  {
    title: "Village",
    path: "/village",
    // options: [
    //   { title: "Village", path: "/product/products" },
    //   { title: "Add Village", path: "/product/add-product" }
      
    // ],
  },

  {
    title: "Habitation",
    path:"Habitation",
    // options: [
    // ],
  },
  {
    title: "Members",
    path:"Members",
    options: [
      // { title: "Members", path: "/report/reports" },
      { title: "Add Members", path: "/AddMember/add-AddMember" },
      // { title: "Sales Report", path: "/report/sales-report" },
      // {title: "Visitor Report", path: "/report/visitor-report"}
      
    ],
  },
  {
    title: "Works",
    path:"works",
    options: [
      { title: "Add-work", path: "/works/add-works" },
      // { title: "Add Works", path: "/main-category/add-main-categorys" },
      
    ],
  },
  {
    title: "Rules",
    path:"Rules",
    options: [
      // { title: "Rules List", path: "attribute/attributelist" },
      { title: "Add Rules", path: "Rules/add-Rules" },
      
    ],
  },

  {
    title: "Settings",
    path: "/settings",
  },
  
];
