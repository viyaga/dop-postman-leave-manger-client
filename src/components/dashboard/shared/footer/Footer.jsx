import { auth } from "@/auth";
import "./footer.scss"
import { removeInitialFromName, textCapitalize } from "@/services";

const Footer = async () => {
  const au = await auth()
  const name = removeInitialFromName(au?.user.name)
  return (
    <div className="footer">
      <span>© {textCapitalize(`Viyaga Enterprises`)}</span>
      <span>👋 {textCapitalize(`Hi ${name}`)}</span>
      </div>
  )
}

export default Footer