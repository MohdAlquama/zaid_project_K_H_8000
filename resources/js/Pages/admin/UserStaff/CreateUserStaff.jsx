import AdminLayout from "@/Layouts/AdminLayout"

import UserStaffForm from "./UserStaffForm"

function CreateUserStaff(props) {
  return <UserStaffForm mode="create" {...props} />
}

export default CreateUserStaff

CreateUserStaff.layout = (page) => <AdminLayout children={page} />
