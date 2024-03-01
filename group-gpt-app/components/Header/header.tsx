import { MainNav } from "./main-nav"
// import UserButton from "./user-button"

export default function Header() {
  return (
    <header className="sticky flex justify-center border-b z-50">
      <div className="flex items-center justify-between w-full h-16  px-4 mx-auto sm:px-6">
        <MainNav />
        {/* <UserButton /> */}
      </div>
    </header>
  )
}
