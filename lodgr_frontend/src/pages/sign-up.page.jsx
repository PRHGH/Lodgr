import Breadcrumbs from "@/Components/Breadcrumbs";
import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <main className="editorial-shell min-h-screen py-8">
      <Breadcrumbs items={[{ label: "Sign up" }]} />
      <div className="flex min-h-[70vh] items-center justify-center">
        <SignUp />
      </div>
    </main>
  );
};

export default SignUpPage;
