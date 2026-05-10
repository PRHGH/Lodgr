import Breadcrumbs from "@/Components/Breadcrumbs";
import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <main className="editorial-shell min-h-screen py-8">
      <Breadcrumbs items={[{ label: "Sign in" }]} />
      <div className="flex min-h-[70vh] items-center justify-center">
        <SignIn />
      </div>
    </main>
  );
};

export default SignInPage;
