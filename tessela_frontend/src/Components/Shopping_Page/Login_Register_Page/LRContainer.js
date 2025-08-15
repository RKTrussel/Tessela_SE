import Navbar from "../Navbar/Navbar";
import SecondNavbar from "../Navbar/SecondNavbar";
import LoginRegisterComponent from "./LRComponent";

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