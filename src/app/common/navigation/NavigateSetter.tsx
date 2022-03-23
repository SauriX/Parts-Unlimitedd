import { useNavigate } from "react-router-dom";
import history from "../../util/history";

const NavigateSetter = () => {
  history.navigate = useNavigate();
  return null;
};

export default NavigateSetter;
