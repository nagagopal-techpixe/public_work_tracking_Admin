import { BookDashed,Contact,Settings,Bell, User,Boxes,Package,Store,ClipboardCheck,Layers,BarChart3,FileText,ListTree,LayoutList,Badge,Image,Sliders} from "lucide-react";

export const SidebarLinks = [
  {
    // icon: BookDashed,
    title: "Dashboard",
    path: "/",
  },
  {
    title: "constituencies",
    options: [
      { title: "constituencies", path: "/constituencies/view-constituencies" },
      { title: "Add constituencies", path: "/constituencies/add-constituencies" },
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
    title: "Volunteers",
    options: [
      { title: "View-Volunteers", path: "/Members/view-Members" },
      { title: "Add Volunteers", path: "/Members/add-Members" },
      // { title: "Sales Report", path: "/report/sales-report" },
      // {title: "Visitor Report", path: "/report/visitor-report"}
      
    ],
  },
  {
    title: "Works",
  
    options: [
      { title: "view-Works", path:"/Works/view-works" },
      { title: "Add-work", path: "/works/add-works" },
      
    ],
  },
  {
    title: "Rules",
    options: [
      { title: "Rules List", path: "/Rules/list" },
      { title: "Add Rules", path: "/Rules/add-Rules" },
      
    ],
  },
 {
    title: "News",
    options: [
      { title: "News List", path: "/News/list" },
      { title: "Add News", path: "/News/add-News" },
      
    ],
  },
  {
    title: "Settings",
    path: "/settings",
  },
  
];
