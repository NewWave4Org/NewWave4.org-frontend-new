import Logo from "./Logo"
import Menu from "./Menu";

const Header = () => {
    return (
            <header className="header">
                <Logo />
                <Menu />
                <div className="flex items-center lg:order-2 gap-x-4">
                    <button type="button" className="language-btn">
                        UA
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                            <path d="M3.47848 5.31307C3.65599 5.13556 3.93376 5.11942 4.12951 5.26466L4.18558 5.31307L8.4987 9.62596L12.8118 5.31307C12.9893 5.13556 13.2671 5.11942 13.4628 5.26466L13.5189 5.31307C13.6964 5.49058 13.7126 5.76836 13.5673 5.9641L13.5189 6.02018L8.85225 10.6868C8.67474 10.8644 8.39696 10.8805 8.20122 10.7353L8.14514 10.6868L3.47848 6.02018C3.28322 5.82492 3.28322 5.50833 3.47848 5.31307Z" fill="#0F1B40"/>
                        </svg>
                    </button>
                    <a href="#" className="donate-btn">Donate</a>                
                </div>
            </header>
    )
}

export default Header;