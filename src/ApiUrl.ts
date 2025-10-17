

const ApiUrls = {
  loginUrls: {
    Login: "/auth/login",
    Register: "/auth/register",
  },

  TaskUrls: {
    GetTasks: "/task/gettask",
    CreateTask: "/task/createtask",
    UpdateTask: "/task/Update",
    DeleteTask: "/task/delete",
  },

  UserUrls: {
    GetProfile: "/user/me",
    GetUserList:  "user/userlist",
    createUer : "auth/createuser"
  },

  ProfileUrls: {
    GetProfile: "/User/me",
    UpdateProfile: "/User/updateprofile",
    ChangePassword: "/User/update-password",
  }
};
export default ApiUrls;
