import Layout from "@/components/Layout";
import Grid from "@/components/Grid";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export async function getServerSideProps(context) {
  // Check if user is authenticated
  const session = await getSession(context);

  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Get all favorited homes from the authenticated user
  const homes = await prisma.home.findMany({
    where: { favoritedBy: { some: { email: session.user.email } } },
  });

  // Pass the data to the Homes component
  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
}

const Homes = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">
        Your favorited homes
      </h1>
      <p className="text-gray-500">View your favorited homes</p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};

export default Homes;
