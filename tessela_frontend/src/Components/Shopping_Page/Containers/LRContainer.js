import Navbar from "../Navbar/Navbar";
import SecondNavbar from "../Navbar/SecondNavbar";
import LoginRegisterComponent from "../Login_Register_Page/LRComponent";

function LoginRegisterContainer() {
    return (
        <>
            <Navbar />
            <SecondNavbar />
            <hr />
            <LoginRegisterComponent />
        </>
    );
}

export default LoginRegisterContainer;