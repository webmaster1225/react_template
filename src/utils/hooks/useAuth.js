import { apiSignIn, apiSignOut, apiSignUp } from "../../api/AuthService";
import { initialState, setUser } from "store/auth/userSlice";
import { onSignInSuccess, onSignOutSuccess } from "store/auth/sessionSlice";
import { useDispatch, useSelector } from "react-redux";

import { REDIRECT_URL_KEY } from "../../config/constant";
import appConfig from "../../config/appConfig";
import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";

function useAuth() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const query = useQuery();

  const { token, signedIn } = useSelector((state) => state.auth.session);

  const signIn = async (values) => {
    try {
      const resp = await apiSignIn(values);
      console.log("response", resp);
      if (resp.status === "success" || resp.status === 200) {
        const { token } = resp.data.tokens.access;
        console.log("token", token);
        dispatch(onSignInSuccess(token));
        if (resp.data.user) {
          const { email, username, id, phoneNumber, profileImage } = resp.data.user;
          dispatch(
            setUser({
              avatar: profileImage || "",
              userName: username || "Anonymous",
              phone: phoneNumber,
              email: email,
              id: id,
            })
          );
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      } else {
        return {
          status: "failed",
          message: resp.data.message,
        };
      }
    } catch (errors) {
      console.log(errors);
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const signUp = async (values) => {
    try {
      const resp = await apiSignUp(values);
      if (resp.data) {
        const { token } = resp.data;
        dispatch(onSignInSuccess(token));
        if (resp.data.user) {
          dispatch(
            setUser(
              resp.data.user || {
                avatar: "",
                userName: "Anonymous",
                authority: ["USER"],
                email: "",
              }
            )
          );
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      }
    } catch (errors) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const handleSignOut = () => {
    dispatch(onSignOutSuccess());
    dispatch(setUser(initialState));
    navigate(appConfig.unAuthenticatedEntryPath);
  };

  const signOut = async () => {
    // await apiSignOut()
    handleSignOut();
  };

  return {
    authenticated: token && signedIn,
    signIn,
    signUp,
    signOut,
  };
}

export default useAuth;
