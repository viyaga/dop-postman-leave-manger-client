import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast"
import "../styles/global.scss";
import ReduxProvider from "@/redux/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  manifest: "/manifest.json",
  title: 'DOP Leave Manager',
  description: 'Department of Post Leave Manager',
  icons: {
    icon: '/logo/logo.svg'
  }
}

export const viewport = {
  themeColor: "#2a3447",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Toaster position='top-center' />
        <div id="backdrop" className="backdrop"></div>
      </body>
    </html>
  );
}
