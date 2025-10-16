import classNames from "classnames";
import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import {
  SidebarProvider,
  useSidebarContext,
} from "../../context/SidebarContext";
import { FaDribbble, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import { MdFacebook } from "react-icons/md";
import SidebarHeader from "./SidebarHeader";
import NavbarHeader from "./NavbarHeader";

export function NavbarSidebar({ children, isFooter = true }) {
  return (
    <SidebarProvider>
      <NavbarHeader />
      <div className="flex items-start">
        <SidebarHeader />
        <MainContent isFooter={isFooter}>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}

function MainContent({ children, isFooter }) {
  const { isOpenOnSmallScreens: isSidebarOpen } = useSidebarContext();

  return (
    <main
      className={classNames(
        "overflow-y-auto absolute lg:relative w-full h-full border bg-gray-50",
        isSidebarOpen ? "" : ""
      )}
    >
      {children}
      {isFooter && (
        <div className="mx-4 mt-4">
          <MainContentFooter />
        </div>
      )}
    </main>
  );
}

function MainContentFooter() {
  return (
    <>
      <Footer container>
        <div className="flex w-full flex-col gap-y-6 lg:flex-row lg:justify-between lg:gap-y-0">
          <FooterLinkGroup>
            <FooterLink href="#" className="mr-3 mb-3 lg:mb-0">
              Terms and conditions
            </FooterLink>
            <FooterLink href="#" className="mr-3 mb-3 lg:mb-0">
              Privacy Policy
            </FooterLink>
            <FooterLink href="#" className="mr-3">
              Licensing
            </FooterLink>
            <FooterLink href="#" className="mr-3">
              Cookie Policy
            </FooterLink>
            <FooterLink href="#">Contact</FooterLink>
          </FooterLinkGroup>
          <FooterLinkGroup>
            <div className="flex gap-4 md:gap-0">
              <FooterLink href="#" className="*:hover:text-black">
                <MdFacebook className="text-lg" />
              </FooterLink>
              <FooterLink href="#" className="*:hover:text-black">
                <FaInstagram className="text-lg" />
              </FooterLink>
              <FooterLink href="#" className="*:hover:text-black">
                <FaGithub className="text-lg" />
              </FooterLink>
              <FooterLink href="#" className="*:hover:text-black">
                <FaTwitter className="text-lg" />
              </FooterLink>
              <FooterLink href="#" className="*:hover:text-black">
                <FaDribbble className="text-lg" />
              </FooterLink>
            </div>
          </FooterLinkGroup>
        </div>
      </Footer>

      <FooterCopyright
        href="#"
        by="FrodenZ Labs. All rights reserved."
        year={new Date().getFullYear()}
      />
    </>
  );
}

export default NavbarSidebar;
