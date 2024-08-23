import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { auth } from "../firebase/config";

const ProtectedRoute = () => {
  //kullanıcnın yetkisi var mı state i
  const [isAuth, setIsAuth] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    // onAuthStateChanged kullanıcı oturmunun değişimini izler
    const unsub = onAuthStateChanged(auth, (user) => {
      //eğer oturum açtıysa yetki true kapattıysa false çek
      setIsAuth(user ? true : false);
    });
    return () => unsub();
  }, []);
  //eğer yetkisi yoksa logine yönlendir
  if (isAuth === false) {
    //useNavigate kullanının bileşen tam yiklenmeden yönlendirme yapmamızdan kaynaklı konsolda hata veriyordu, bu sebeple Navigate bileşeni kullandık, bunu kullanınca browserrouter bileşenin yiklenme işlemini tamamlamış gibi algılayı to propu olarak tanımladığımız sayfaya yönlendiriyor
    return <Navigate to={"/"} />;
  }
  //kapsayıcı bir toute da alt route çağırma
  return <Outlet />;
};

export default ProtectedRoute;
