import { useNavigate } from "react-router-dom";

const useNavigateBack = (fallback = "/") => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1, { replace: true, state: { fallback } });
  };

  return goBack;
};

export default useNavigateBack;
