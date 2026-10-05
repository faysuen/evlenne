import "./globals.css";
import {Newsreader,Arimo} from "next/font/google";
import AuthRedirect from "./components/AuthRedirect";
import {SiteHeader,SiteFooter} from "./components/SiteChrome";
const serif=Newsreader({subsets:["latin"],style:["normal","italic"],weight:["400","500"],variable:"--font-serif"});
const sans=Arimo({subsets:["latin"],weight:["400"],variable:"--font-pets-sans"});
export const metadata={
  title:"Evlenne | Personalized Pet Lifestyle",
  description:"One pet. A world made personal. Create a reusable pet identity for personalized jewelry, keepsakes, travel pieces and more."
};
export default function RootLayout({children}){return <html lang="en"><body className={`${serif.variable} ${sans.variable}`}><AuthRedirect/><SiteHeader/>{children}<SiteFooter/></body></html>}
