export const authConfig = {
  providers: [],
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      const isOnEmployeePage = request.nextUrl.pathname.startsWith("/employee");

      if (isOnDashboard || isOnEmployeePage) {
        if (isLoggedIn) return true;
        return false;
      }
      
      return true;
    },
  },
};