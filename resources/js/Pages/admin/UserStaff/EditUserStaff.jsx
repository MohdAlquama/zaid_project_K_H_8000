import AdminLayout from "@/Layouts/AdminLayout"

import UserStaffForm from "./UserStaffForm"

function EditUserStaff(props) {
  return <UserStaffForm mode="edit" {...props} />
}

export default EditUserStaff

EditUserStaff.layout = (page) => <AdminLayout children={page} />
