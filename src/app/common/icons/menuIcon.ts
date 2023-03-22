import {
  faBookMedical,
  faBoxesStacked,
  faBuilding,
  faBuildingShield,
  faCalendarCheck,
  faChartColumn,
  faChartLine,
  faCircle,
  faFileContract,
  faFileInvoiceDollar,
  faFlaskVial,
  faFolder,
  faFolderOpen,
  faGears,
  faHospitalUser,
  faLaptopFile,
  faListCheck,
  faListOl,
  faReceipt,
  faRoute,
  faSackDollar,
  faTags,
  faThumbsUp,
  faUserDoctor,
  faUserGear,
  faUsers,
  faVial,
  faVials,
  faArrowsTurnToDots,
  faLaptopMedical,
  faChalkboardUser,
  faMagnifyingGlass,
  faMagnifyingGlassArrowRight,
  faMapLocation,
  faClipboardList,
  faSyringe,
  faMoneyBill1Wave,
  faFileMedical,
  faFileInvoice,
  faMoneyBills,
  faCalendarDay
} from "@fortawesome/free-solid-svg-icons";

const getMenuIcon = (name: string) => {
  switch (name) {
    case "cat":
      return faFolder;
    case "role":
      return faUserGear;
    case "user":
      return faUsers;
    case "branch":
      return faHospitalUser;
    case "company":
      return faBuilding;
    case "medic":
      return faUserDoctor;
    case "study":
      return faVials;
    case "reagent":
      return faFlaskVial;
    case "indication":
      return faListCheck;
    case "parameter":
      return faListOl;
    case "catalog":
      return faFolderOpen;
    case "price":
      return faSackDollar;
    case "pack":
      return faBoxesStacked;
    case "promo":
      return faReceipt;
    case "loyalty":
      return faThumbsUp;
    case "tag":
      return faTags;
    case "route":
      return faRoute;
    case "maquila":
      return faBuildingShield;
    case "configuration":
      return faGears;
    case "equipment":
      return faFolder;
    case "MedicalRecord":
      return faBookMedical;
    case "cotizacion":
      return faFileInvoiceDollar;
    case "report":
      return faChartColumn;
    case "reportstudy":
      return faCalendarDay;
    case "results":
      return faFileMedical;
    case "appointments":
      return faCalendarCheck;
    case "reception":
      return faLaptopFile;
    case "sampling":
      return faSyringe;
    case "request":
      return faFileContract;
    case "cash":
      return faChartLine;
    case "requestedstudy":
      return faArrowsTurnToDots;
    case "clinicResults":
      return faChalkboardUser;
    case "massSearch":
      return faMagnifyingGlass;
    case "deliveryResults":
      return faMagnifyingGlassArrowRight;
    case "deliveryResults":
      return faMagnifyingGlassArrowRight;
    case "RouteTracking":
      return faMapLocation;
    case "worklist":
      return faClipboardList;
    case "relaseResult":
      return faListCheck;
    case "quotation":
      return faMoneyBill1Wave;
    case "invoice":
      return faMoneyBills;
    case "series":
      return faFileInvoice;
    default:
      return faCircle;
  }
};

export default getMenuIcon;
