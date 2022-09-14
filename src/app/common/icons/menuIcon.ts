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
  faLaptopMedical
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
    case "expedientes":
      return faBookMedical;
    case "cotizacion":
      return faFileInvoiceDollar;
    case "report":
      return faChartColumn;
    case "appointments":
      return faCalendarCheck;
    case "reception":
      return faLaptopFile;
    case "samplings":
      return faVial;
    case "request":
      return faFileContract;
    case "cash":
      return faChartLine;
    case "requestedstudy":
      return faArrowsTurnToDots;
    case "clinicResults":
      return faLaptopMedical;
    default:
      return faCircle;
  }
};

export default getMenuIcon;
